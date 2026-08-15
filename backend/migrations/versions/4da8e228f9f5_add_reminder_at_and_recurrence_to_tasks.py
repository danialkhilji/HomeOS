"""add reminder_at and recurrence to tasks

Revision ID: 4da8e228f9f5
Revises: 5dd760504b41
Create Date: 2026-08-13 10:01:08.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4da8e228f9f5'
down_revision: Union[str, None] = '5dd760504b41'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('tasks', sa.Column('reminder_at', sa.DateTime(), nullable=True))
    op.add_column('tasks', sa.Column('recurrence', sa.String(length=20), nullable=False, server_default='none'))


def downgrade() -> None:
    op.drop_column('tasks', 'recurrence')
    op.drop_column('tasks', 'reminder_at')
