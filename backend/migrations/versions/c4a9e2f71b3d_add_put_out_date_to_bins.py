"""add put_out_date to bins

Revision ID: c4a9e2f71b3d
Revises: 87efc5b310f0
Create Date: 2026-10-21 12:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4a9e2f71b3d'
down_revision: Union[str, None] = '87efc5b310f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('bins', sa.Column('put_out_date', sa.Date(), nullable=True))


def downgrade() -> None:
    op.drop_column('bins', 'put_out_date')
