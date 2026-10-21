"""create bins and bin_settings tables

Revision ID: 87efc5b310f0
Revises: 83eed160c486
Create Date: 2026-10-20 22:30:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '87efc5b310f0'
down_revision: Union[str, None] = '83eed160c486'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('bins',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('colour', sa.String(length=7), nullable=False),
    sa.Column('icon', sa.String(length=20), nullable=False),
    sa.Column('schedule', sa.String(length=10), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bin_settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('collection_weekday', sa.Integer(), nullable=False),
    sa.Column('week_a_date', sa.Date(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('bin_settings')
    op.drop_table('bins')
