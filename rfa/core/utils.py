from django.core.mail import EmailMessage


class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data['subject'], body=data['email_body'], to=[data['to_email']], from_email=data['from_email'])
        email.send()
