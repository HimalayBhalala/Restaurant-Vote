from rest_framework import serializers
from .models import Restaurant,Vote,Winner,History
import datetime

class VoteSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    class Meta:
        model = Vote
        fields = ["id","customer","restaurant","vote","date","customer_name"]

    def get_customer_name(self,obj):
        user = obj.customer.user
        return user.first_name

class RestaurantSerializer(serializers.ModelSerializer):
    vote_total = serializers.SerializerMethodField(read_only=True)
    resturant_vote = VoteSerializer(many=True,read_only=True)
    class Meta:
        model = Restaurant
        fields = ["id", "name", "boss","resturant_vote","vote_total"]
        extra_kwargs = {
            "id": {"read_only": True},
            "boss": {"read_only": True}
        }
        depth = 1

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Please enter a restaurant name.")
        return value

    def create(self, validated_data):
        return Restaurant.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name',instance.name)
        instance.save()
        return instance

    def get_vote_total(self,obj):
        sum = 0
        votes = Vote.objects.filter(restaurant=obj,date=datetime.date.today())
        for vote in votes:
            sum += vote.vote
        return {"total_vote":sum}
    
class WinnerSerializer(serializers.ModelSerializer):
    vote_total = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Winner
        fields = ["id","restaurant","date","vote_total"]
        depth = 1

    def get_vote_total(self,obj):
        sum = 0
        votes = Vote.objects.filter(restaurant=obj.restaurant,date=datetime.date.today())
        for vote in votes:
            sum += vote.vote
        return {"total_vote":sum}