from django.urls import path
from . import views

urlpatterns = [

    #----------------------------------------------- User -----------------------------------------
    path('change/password/<int:user_id>/',views.ChangePasswordView.as_view(),name="change-password"),
    path('forget/password/<int:user_id>/',views.ForgetPasswordView.as_view(),name="forget-password"),
    #----------------------------------------------- Customer --------------------------------------
    path('customer/login/', views.CustomerLoginAPIView.as_view(), name='customer-login'),
    path('customer/register/',views.CustomerRegistrationView.as_view(),name="customer-registration"),
    path('customer/add/email/',views.CustomerEmailVerificationView.as_view(),name='customer-email-verification'),
    path('customer/', views.GetCustomerAPIView.as_view(), name='get-customer'),
    #----------------------------------------------- Boss ---------------------------------------
    path('boss/login/', views.BossLoginAPIView.as_view(), name='boss-login'),
    path('boss/register/',views.BossRegistrationView.as_view(),name="boss-registration"),
    path('boss/add/email/',views.BossEmailVerificationView.as_view(),name='boss-email-verification'),
    path('boss/', views.GetBossAPIView.as_view(), name='get-boss'),
]
