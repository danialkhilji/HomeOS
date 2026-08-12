"""add sort_order to tasks and shopping_items

Revision ID: 7ecf7fc994fb
Revises: 7fe7d81f5c18
Create Date: 2026-08-12 13:58:56.256130
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7ecf7fc994fb'
down_revision: Union[str, None] = '7fe7d81f5c18'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('tasks', sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('shopping_items', sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'))


def downgrade() -> None:
    op.drop_column('tasks', 'sort_order')
    op.drop_column('shopping_items', 'sort_order')
