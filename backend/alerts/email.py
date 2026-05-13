import os
import smtplib
from email.message import EmailMessage


def send_email_alert(to_address: str, subject: str, body: str) -> None:
    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    from_address = os.getenv("SMTP_FROM", "alerts@marketradar.local")
    port = int(os.getenv("SMTP_PORT", "587"))
    if not host or not to_address:
        return

    message = EmailMessage()
    message["From"] = from_address
    message["To"] = to_address
    message["Subject"] = subject
    message.set_content(body)

    with smtplib.SMTP(host, port) as smtp:
        smtp.starttls()
        if username and password:
            smtp.login(username, password)
        smtp.send_message(message)
