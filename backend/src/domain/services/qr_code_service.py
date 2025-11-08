"""
QR Code generation service for artworks
"""
import qrcode
from io import BytesIO
import base64
from typing import Optional


class QRCodeService:
    """Domain service for generating QR codes for artworks"""
    
    @staticmethod
    def generate_qr_code_for_artwork(artwork_id: int, frontend_url: str) -> str:
        """
        Generate QR code for an artwork that points to the frontend
        
        Args:
            artwork_id: The ID of the artwork
            frontend_url: The base URL of the frontend application
            
        Returns:
            Base64 encoded QR code image
        """
        if artwork_id <= 0:
            raise ValueError("Artwork ID must be positive")
        
        if not frontend_url or not frontend_url.strip():
            raise ValueError("Frontend URL is required")
        
        # Create URL pointing to frontend artwork detail page
        artwork_url = f"{frontend_url.rstrip('/')}/artwork/{artwork_id}"
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(artwork_url)
        qr.make(fit=True)
        
        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        img_data = buffer.getvalue()
        
        # Return base64 encoded string
        return base64.b64encode(img_data).decode()
    
    @staticmethod
    def save_qr_code_to_file(qr_code_data: str, file_path: str) -> None:
        """
        Save base64 QR code data to file
        
        Args:
            qr_code_data: Base64 encoded QR code image
            file_path: Path where to save the QR code file
        """
        if not qr_code_data:
            raise ValueError("QR code data is required")
        
        if not file_path:
            raise ValueError("File path is required")
        
        # Decode base64 and save to file
        img_data = base64.b64decode(qr_code_data)
        with open(file_path, 'wb') as f:
            f.write(img_data)