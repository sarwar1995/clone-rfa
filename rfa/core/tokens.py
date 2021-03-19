from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six


class TokenGenerator(PasswordResetTokenGenerator):
    """This class generates a user specific token that uses Django's PasswordResetTokenGenerator and a user specific parameter like
    is_active to generate a token that will be invalid after the user is verified and activated """

    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.username) + six.text_type(timestamp) +
            six.text_type(user.is_active)

        )


account_activation_token = TokenGenerator()
