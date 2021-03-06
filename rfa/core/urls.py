from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from .views import ObtainTokenPairWithNameView, CreateReadingList, GetReadingList, DeleteReadingList, EditReadingList, CustomUserCreate, LogoutAndBlacklistRefreshTokenForUserView, VerifyEmail, GetByUsernameView, GetTopComments



urlpatterns = [
    path('user/create/', CustomUserCreate.as_view(), name="create_user"),
    path('user/email-verify/', VerifyEmail.as_view(), name="verify_email"),
    path('user/getByUsername/', GetByUsernameView.as_view(), name="get_by_username"),
    path('user/reading-list/create/', CreateReadingList.as_view(), name="create_reading_list"),
    path('user/reading-list/delete/', DeleteReadingList.as_view(), name="delete_reading_list"),
    path('user/reading-list/edit/', EditReadingList.as_view(), name="edit_reading_list"),
    path('user/reading-list/get/', GetReadingList.as_view(), name="get_reading_list"),
    path('user/top-comments/', GetTopComments.as_view(), name="get_top_comments"),
    path('token/obtain/', ObtainTokenPairWithNameView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(),
         name='blacklist'),
]
