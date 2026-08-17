"""add purchased_at to shopping_items

Revision ID: 83eed160c486
Revises: 3a17512a60fb
Create Date: 2026-08-17 18:00:20.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '83eed160c486'
down_revision: Union[str, None] = '3a17512a60fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('shopping_items', sa.Column('purchased_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('shopping_items', 'purchased_at')