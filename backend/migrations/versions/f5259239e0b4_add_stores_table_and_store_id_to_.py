"""add stores table and store_id to shopping_items

Revision ID: f5259239e0b4
Revises: 7ecf7fc994fb
Create Date: 2026-08-12 15:19:59.848278
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f5259239e0b4'
down_revision: Union[str, None] = '7ecf7fc994fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('stores',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('colour', sa.String(length=7), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.add_column('shopping_items', sa.Column('store_id', sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column('shopping_items', 'store_id')
    op.drop_table('stores')
