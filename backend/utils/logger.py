import logging

logging.basicConfig(
    filename="app.log",          # log file
    level=logging.INFO,          # level
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)