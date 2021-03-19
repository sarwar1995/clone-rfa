from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser
from django.core.validators import EmailValidator


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims. We don't need affilation as a custom claim to verify the user. Only username and password will suffice
        return token


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """
    # email = serializers.EmailField(
    #     required=True
    # )
    # username = serializers.CharField()
    # password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'affiliation',
                  'position', 'email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        """
        Check that the username is not already taken by searching for it in the database via model.objects. 
        If a user with that username is found then raise a validation error.
        """
        try:
            user = self.Meta.model.objects.get(username=value)
            raise serializers.ValidationError(
                "username is already taken. Please enter a different username")
        except User.DoesNotExist:
            return value

    def validate_email(self, value):
        """
        First check that the email is not already taken by searching for it in the database via model.objects. 
        If no user with that email is found then check that the email is a valid one (i.e. abc@xyz.com).
        """
        try:
            user = self.Meta.model.objects.get(email=value)
            raise serializers.ValidationError(
                "email is already taken please enter a different email")
        except user.DoesNotExist:
            validate_email = EmailValidator()
            validate_email(value)
            return value

    def create(self, validated_data):
        """
        This create method is only called when "user = serializer.save()" is called in views.py after validating the serializer
        via the validate_email and validate_username methods have already been called. And if serializer aka data in
        the form is valid then the create method checks for password and if not None saves an instance of the model
        (aka user) in the databse.
        """
        password = validated_data.pop('password', None)
        # as long as the fields are the same, we can just use this
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
