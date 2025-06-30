"""add missing tables

Revision ID: b9a958607adf
Revises: 4ed603c2ea4c
Create Date: 2025-06-27 17:53:22.521720

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = 'b9a958607adf'
down_revision = '4ed603c2ea4c'
branch_labels = None
depends_on = None

def upgrade():
    bind = op.get_bind()
    inspector = inspect(bind)
    tables = inspector.get_table_names()

    if 'tag' not in tables:
        op.create_table(
            'tag',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('name', sa.String(length=50), nullable=False),
            sa.UniqueConstraint('name')
        )

    if 'user' not in tables:
        op.create_table(
            'user',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('username', sa.String(length=80), nullable=False),
            sa.Column('email', sa.String(length=120), nullable=False),
            sa.Column('password_hash', sa.String(length=512), nullable=False),
            sa.Column('role', sa.String(length=20), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.UniqueConstraint('username'),
            sa.UniqueConstraint('email')
        )

    if 'parcel' not in tables:
        op.create_table(
            'parcel',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('description', sa.String(length=255), nullable=True),
            sa.Column('status', sa.String(length=50), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('sender_id', sa.Integer(), nullable=False),
            sa.Column('receiver_id', sa.Integer(), nullable=True),
            sa.ForeignKeyConstraint(['sender_id'], ['user.id']),
            sa.ForeignKeyConstraint(['receiver_id'], ['user.id'])
        )

    if 'parcel_tag' not in tables:
        op.create_table(
            'parcel_tag',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('parcel_id', sa.Integer(), nullable=False),
            sa.Column('tag_id', sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(['parcel_id'], ['parcel.id']),
            sa.ForeignKeyConstraint(['tag_id'], ['tag.id'])
        )

    if 'tracking_log' not in tables:
        op.create_table(
            'tracking_log',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('parcel_id', sa.Integer(), nullable=False),
            sa.Column('status', sa.String(length=100), nullable=False),
            sa.Column('location', sa.String(length=100), nullable=True),
            sa.Column('timestamp', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['parcel_id'], ['parcel.id'])
        )

def downgrade():
    op.drop_table('tracking_log')
    op.drop_table('parcel_tag')
    op.drop_table('parcel')
    op.drop_table('user')
    op.drop_table('tag')
