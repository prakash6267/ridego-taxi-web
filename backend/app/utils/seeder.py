import logging
from sqlalchemy.orm import Session
from app.models.admin import Admin
from app.models.car import Car
from app.models.driver import Driver
from app.models.setting import Setting
from app.utils.security import get_password_hash
from app.config import settings

logger = logging.getLogger(__name__)

def seed_database(db: Session) -> None:
    """Seed default admin, dynamic cars, drivers, and initial settings if missing."""
    
    # 1. Seed Admin
    existing_admin = db.query(Admin).first()
    if not existing_admin:
        default_admin = Admin(
            username="admin",
            email="admin@taxigo.com",
            password_hash=get_password_hash("admin123"),
            full_name="Fleet Operations Manager",
            is_superadmin=True
        )
        db.add(default_admin)
        logger.info("Created default admin user: admin / admin123")

    # 2. Seed Default Cars
    if db.query(Car).count() == 0:
        sample_cars = [
            Car(
                name="Sedan Prime (Dzire / Etios)",
                model="Maruti Suzuki Dzire",
                car_number="MP-09-AB-1234",
                car_type="Sedan",
                seats=4,
                has_ac=True,
                image_url="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
                base_fare=50.0,
                per_km_rate=10.0,
                minimum_fare=150.0,
                is_active=True,
                sort_order=1
            ),
            Car(
                name="SUV Prime (Brezza / Creta)",
                model="Hyundai Creta",
                car_number="MP-09-CD-5678",
                car_type="SUV",
                seats=4,
                has_ac=True,
                image_url="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80",
                base_fare=70.0,
                per_km_rate=14.0,
                minimum_fare=200.0,
                is_active=True,
                sort_order=2
            ),
            Car(
                name="Ertiga 7-Seater Family",
                model="Maruti Suzuki Ertiga",
                car_number="MP-09-EF-9012",
                car_type="Ertiga",
                seats=6,
                has_ac=True,
                image_url="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
                base_fare=100.0,
                per_km_rate=16.0,
                minimum_fare=250.0,
                is_active=True,
                sort_order=3
            ),
            Car(
                name="Innova Crysta Luxury",
                model="Toyota Innova Crysta",
                car_number="MP-09-GH-3456",
                car_type="Innova",
                seats=7,
                has_ac=True,
                image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
                base_fare=150.0,
                per_km_rate=20.0,
                minimum_fare=350.0,
                is_active=True,
                sort_order=4
            ),
        ]
        db.add_all(sample_cars)
        logger.info("Seeded initial car fleet with rates (Sedan ₹10/km, SUV ₹14/km, Ertiga ₹16/km, Innova ₹20/km)")

    # 3. Seed Drivers
    if db.query(Driver).count() == 0:
        sample_drivers = [
            Driver(
                name="Rajesh Kumar Verma",
                phone="6267228958",
                license_number="DL-MP09-2018-00451",
                vehicle_model="Maruti Dzire (MP-09-AB-1234)",
                rating=4.95,
                status="Available",
                is_active=True
            ),
            Driver(
                name="Amit Sharma",
                phone="9826012345",
                license_number="DL-MP09-2019-00892",
                vehicle_model="Toyota Innova (MP-09-GH-3456)",
                rating=4.90,
                status="Available",
                is_active=True
            ),
            Driver(
                name="Vikram Singh Rathore",
                phone="9425098765",
                license_number="DL-MP09-2017-00129",
                vehicle_model="Maruti Ertiga (MP-09-EF-9012)",
                rating=4.88,
                status="Available",
                is_active=True
            )
        ]
        db.add_all(sample_drivers)
        logger.info("Seeded initial driver roster.")

    # 4. Seed Settings
    default_settings = {
        "primary_contact_phone": settings.PRIMARY_CONTACT_PHONE,
        "primary_contact_email": settings.PRIMARY_CONTACT_EMAIL,
        "upi_id": settings.DEFAULT_UPI_ID,
        "company_name": "TaxiGo Commercial Cabs",
        "service_city": "Indore & Central India",
        "emergency_number": "6267228958",
        "terms_condition": "Standard commercial taxi booking rules apply. Night charges included in estimate."
    }

    for key, val in default_settings.items():
        if not db.query(Setting).filter(Setting.key == key).first():
            db.add(Setting(key=key, value=val, description=f"Default setting for {key}"))

    db.commit()
