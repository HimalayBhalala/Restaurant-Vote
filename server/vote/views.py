from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Restaurant, Vote, Winner, History
from .serializers import RestaurantSerializer, VoteSerializer, WinnerSerializer, HistorySerializer
from authentication.models import Customer,User
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
import datetime
from django.shortcuts import get_object_or_404

VOTES_PER_DAY = 3

class RestaurantView(APIView):
    def get(self, request, admin_id, *args, **kwargs):
        restaurant_id = request.query_params.get('restaurant_id', None)
        if restaurant_id:
            try:
                restaurant = Restaurant.objects.get(id=restaurant_id)
                serializer = RestaurantSerializer(restaurant)
                return Response({"data": serializer.data}, status=status.HTTP_200_OK)
            except Restaurant.DoesNotExist:
                return Response({"message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            restaurants = Restaurant.objects.filter(boss_id=admin_id)
            serializer = RestaurantSerializer(restaurants, many=True)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, admin_id, *args, **kwargs):
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(boss_id=admin_id)
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"message": "Restaurant could not be created", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, admin_id, *args, **kwargs):
        restaurant_id = request.query_params.get('restaurant_id', None)
        if not restaurant_id:
            return Response({"message": "Restaurant ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            return Response({"message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"message": "Restaurant could not be updated", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, admin_id, *args, **kwargs):
        restaurant_id = request.query_params.get('restaurant_id', None)
        if not restaurant_id:
            return Response({"message": "Restaurant ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
            restaurant.delete()
            return Response({"message": "Restaurant deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Restaurant.DoesNotExist:
            return Response({"message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

class getAllRestaurant(ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class getVoteResturant(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, restaurant_id, customer_id):
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
            customer = Customer.objects.get(id=customer_id)
        except Restaurant.DoesNotExist:
            return Response({"message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        except Customer.DoesNotExist:
            return Response({"message": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

        today = datetime.date.today()
        existing_votes = Vote.objects.filter(customer=customer, date=today).count()
        if existing_votes >= VOTES_PER_DAY:
            return Response({"message": "Vote limit reached for today"}, status=status.HTTP_400_BAD_REQUEST)

        previous_votes = Vote.objects.filter(customer=customer, restaurant=restaurant)
        if previous_votes.count() > 0:
            last_vote = previous_votes.last()
            if previous_votes.count() == VOTES_PER_DAY and last_vote.date == today:
                return Response({"message": "You have already voted for this restaurant today"}, status=status.HTTP_400_BAD_REQUEST)

        vote_value = 1.0
        if previous_votes.count() > 0:
            vote_value = 0.5 if previous_votes.count() == 1 else 0.25

        serializer = VoteSerializer(data={
            'customer': customer.id,
            'restaurant': restaurant.id,
            'vote': vote_value,
        })

        if serializer.is_valid():
            serializer.save()
            self.calculate_winner()
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"message": "Vote could not be created", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def calculate_winner(self):
        today = datetime.date.today()
        votes = Vote.objects.filter(date=today)
        if not votes.exists():
            return

        restaurant_scores = {}
        for vote in votes:
            if vote.restaurant.id not in restaurant_scores:
                restaurant_scores[vote.restaurant.id] = {'score': 0, 'customer_count': set()}
            restaurant_scores[vote.restaurant.id]['score'] += vote.vote
            restaurant_scores[vote.restaurant.id]['customer_count'].add(vote.customer.id)

        sorted_restaurants = sorted(restaurant_scores.items(), key=lambda x: (x[1]['score'], len(x[1]['customer_count'])), reverse=True)
        if sorted_restaurants:
            top_restaurant_id = sorted_restaurants[0][0]
            Winner.objects.create(restaurant_id=top_restaurant_id, date=today)

class WinnerHistory(APIView):
    def get(self, request, *args, **kwargs):
        latest_winner = Winner.objects.all().order_by("-date").first()
        if not latest_winner:
            return Response({"message": "No winners found"}, status=status.HTTP_404_NOT_FOUND)
        
        History.objects.update_or_create(
            winner=latest_winner,
        )

        winner_serializer = WinnerSerializer(latest_winner)
        return Response({"data": winner_serializer.data}, status=status.HTTP_200_OK)

class getRestaurantVoteView(APIView):
    def get(self, request, customer_id):
        try:
            customer = Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            return Response({"message": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
        vote = Vote.objects.filter(customer=customer)
        vote_serializer = VoteSerializer(vote, many=True)
        return Response({"data": vote_serializer.data}, status=status.HTTP_200_OK)
    
class PastHistory(ListAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializer


class CheckVoteStatus(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, restaurant_id):
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        customer = Customer.objects.get(user=user)
        has_voted = Vote.objects.filter(customer=customer, restaurant_id=restaurant_id).exists()
        return Response({"has_voted": has_voted}, status=status.HTTP_200_OK)