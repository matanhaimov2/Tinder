git clone https://github.com/matanhaimov2/Tinder.git dev

Create a Virtual Environment:
    python -m venv venv

Start Virtual Environment:
    venv\Scripts\activate (before: open powershell as admin and enter: Set-ExecutionPolicy Unrestricted -Force)

Install Requirements:
pip install -r requirements.txt

Apply Migrations:
    python manage.py migrate

Start Server:
python manage.py runserver
