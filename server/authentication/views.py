from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import (
    CreateUserSerializer,
    LoginSerializer,
    ChangedPasswordSerializer,
    EmailVerificationSerializer,
    CustomerSerializer,
    CustomerRegistrationSerializer,
    BossSerializer,
    BossRegistrationSerializer,
)
from .models import Customer, Boss
from .models import User

#-------------------------------------------------------- User ------------------------------------------------

class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        serializer = ChangedPasswordSerializer(user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"message": "Password Updated Successfully...."}, status=status.HTTP_202_ACCEPTED)
        return Response({"error": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

class ForgetPasswordView(APIView):
    def put(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        serializer = ChangedPasswordSerializer(user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"message": "Password Updated Successfully...."}, status=status.HTTP_202_ACCEPTED)
        return Response({"error": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

#------------------------------------------------------- Customer ----------------------------------------------

class CustomerRegistrationView(APIView):
    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            customer = Customer.objects.create(user=user)
            customer_serializer = CustomerRegistrationSerializer(customer)
            token = RefreshToken.for_user(user)

            response_data = {
                'token': {
                    'access_token': str(token.access_token),
                    'refresh_token': str(token),
                },
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'mobile': customer_serializer.data.get('mobile')
                },
                'customer': {
                    'id': customer_serializer.data.get('id'),
                }
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomerLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']

            token = RefreshToken.for_user(user)

            try:
                customer = Customer.objects.get(user=user)
                customer_serializer = CustomerSerializer(customer)
                customer_data = customer_serializer.data
            except Customer.DoesNotExist:
                return Response({"message": "Customer is not found"})

            response_data = {
                'access_token': str(token.access_token),
                'refresh_token': str(token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'customer': customer_data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class CustomerEmailVerificationView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if email is None:
            return Response({"message": "Email is required or not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            user = User.objects.get(email=email)
            serializer = EmailVerificationSerializer(user)
            return Response({"user": serializer.data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"data": "User does not exist with the given email"}, status=status.HTTP_404_NOT_FOUND)
        
class GetCustomerAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            return Response({"message": "Boss not found"}, status=status.HTTP_404_NOT_FOUND)

#-------------------------------------------------------- Boss ------------------------------------------------------

class BossRegistrationView(APIView):
    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_staff = True
            user.save()

            boss = Boss.objects.create(user=user)
            boss_serializer = BossRegistrationSerializer(boss)
            token = RefreshToken.for_user(user)

            response_data = {
                'token': {
                    'access_token': str(token.access_token),
                    'refresh_token': str(token),
                },
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'boss': {
                    'id': boss_serializer.data.get('id'),
                }
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BossLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']

            token = RefreshToken.for_user(user)

            try:
                boss = Boss.objects.get(user=user)
                boss_serializer = BossSerializer(boss)
                boss_data = boss_serializer.data
            except Boss.DoesNotExist:
                return Response({"message": "Boss is not found"})

            response_data = {
                'access_token': str(token.access_token),
                'refresh_token': str(token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'boss': boss_data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class BossEmailVerificationView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if email is None:
            return Response({"message": "Email is required or not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            user = User.objects.get(email=email, is_staff=True)
            serializer = EmailVerificationSerializer(user)
            return Response({"user": serializer.data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"data": "User does not exist with the given email"}, status=status.HTTP_404_NOT_FOUND)


class GetBossAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            boss = Boss.objects.get(user=request.user)
            serializer = BossSerializer(boss)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Boss.DoesNotExist:
            return Response({"message": "Boss not found"}, status=status.HTTP_404_NOT_FOUND)