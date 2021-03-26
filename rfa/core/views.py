from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, CustomUserSerializer
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .tokens import account_activation_token
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import Util
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist


class HelloWorldView(APIView):
    def get(self, request):
        return Response(data={"hello": "world"}, status=status.HTTP_200_OK)


class ObtainTokenPairWithColorView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class CustomUserCreate(APIView):
    """ 
    The post method checks whether the serializer is_valid and then saves the inactive (not verified) 
    user to the database and sends an email to the user. The email contains a unique link containing 
    url encoded user id and a password reset token that is used to verify the user in the VerifyEmail view.
    Another way of obtaining a unique token is by using jwt RefreshToken. However, an issue with using jwt 
    refresh tokens is that the token is valid only for 5 minutes and it stays valid even after the user has
    used it once. The benefit of using the reset password token provided by django is that it becomes invalid 
    after the user has used it once and stays valid for PASSWORD_RESET_TIMEOUT_DAYS (currently = 1) days.
    """
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            to_email = serializer.validated_data['email']
            # This saves the user in the database with the attribute is_active=False (default)
            user = serializer.save()

            token = account_activation_token.make_token(user)
            url_safe_uid = urlsafe_base64_encode(force_bytes(user.pk))
            #token = RefreshToken.for_user(user).access_token

            current_site = get_current_site(request).domain
            relative_link = reverse('verify_email')
            absolute_url = "http://" + current_site + relative_link + \
                "?token=" + token + "&uidb64=" + url_safe_uid
            email_body = 'Hello! ' + user.username + '\n'\
                'Thanks for signing up on Research For All (RFA). Click the link below to verify your account.\n This link is only valid for a day: ' + absolute_url
            email_data = {'subject': 'Verify your Research For All (RFA) account',
                          'email_body': email_body,
                          'to_email': to_email,
                          'from_email': '"RFA Team" <rfa.researchforall@gmail.com>'}
            Util.send_email(email_data)
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmail(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        User = get_user_model()
        token = request.GET.get('token')
        uidb64 = request.GET.get('uidb64')
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)
        except (TypeError, ValueError, OverflowError, ObjectDoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            if not user.is_active:
                user.is_active = True
                user.save()
            return Response({'Success': 'Email successfully verified and account activated'}, status=status.HTTP_200_OK)
        else:
            return Response({'Failure': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

        # payload = jwt.decode(token, settings.SECRET_KEY)
        # except jwt.ExpiredSignatureError as expired:
        #     return Response({'error': 'Activation link expired'}, status=status.HTTP_400_BAD_REQUEST)
        # except jwt.exceptions.DecodeError as error:
        #     return Response({'error': 'Invalid token. Request new one'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAndBlacklistRefreshTokenForUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
