from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework.exceptions import AuthenticationFailed
from .models import Boss,Customer,User

class CreateUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "password", "confirm_password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "id": {"read_only": True},
        }

    def validate(self, data):
        email = data.get("email")
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if not email:
            raise serializers.ValidationError("Email must be required")
        if not first_name:
            raise serializers.ValidationError("First name must be required")
        if not last_name:
            raise serializers.ValidationError("Last name must be required")
        if not password:
            raise serializers.ValidationError("Password must be required")
        if password != confirm_password:
            raise serializers.ValidationError("Password and Confirm_password do not match")

        return data

    def create(self, validated_data):
        email = validated_data.get("email")
        first_name = validated_data.get("first_name")
        last_name = validated_data.get("last_name")
        password = validated_data.get("password")

        user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, password=password)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=200)
    password = serializers.CharField(max_length=200)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email:
            raise serializers.ValidationError('Email must be required')
        if not password:
            raise serializers.ValidationError('Password must be required')

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise AuthenticationFailed('Invalid credentials, please try again')

        data['user'] = user
        return data
    
class ChangedPasswordSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ["id","new_password","confirm_new_password"]
        extra_kwargs = {"new_password":{"read_only":True},'confirm_new_password':{'read_only':True}}

    def validate(self, data):
        new_password = data.get('new_password')
        confirm_new_password = data.get('confirm_new_password')
        if new_password is None:
            raise serializers.ValidationError({"message":"New Password is required"})
        
        if confirm_new_password is None:
            raise serializers.ValidationError({"message":"Confirm New Password is required"})

        if new_password != confirm_new_password:
            raise serializers.ValidationError({"message":"New Password and Confirm New Password is not matched"})
        return data

    def update(self, instance, validated_data):
        new_password = validated_data.get('new_password')

        instance.set_password(new_password)
        instance.save()
        return instance

class EmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","email","first_name","last_name"]


#---------------------------------------------------------- Boss -----------------------------------------------


class BossSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boss
        fields = ['id', 'user']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = instance.user.email
        return representation

class BossRegistrationSerializer(serializers.ModelSerializer):
    user = CreateUserSerializer(read_only=True)
    class Meta:
        model = Boss
        fields = ["id", "user"]
        extra_kwargs = {
            "id": {"read_only": True}
        }

    def to_representation(self, instance):
        representation =  super().to_representation(instance)
        representation['user'] = instance.user
        return representation

#---------------------------------------------------- Customer ----------------------------------------------


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'user']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = instance.user.email
        return representation
    
class CustomerRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "user"]
        extra_kwargs = {
            "id": {"read_only": True}
        }

    def to_representation(self, instance):
        representation =  super().to_representation(instance)
        representation['user'] = instance.user
        return representation 