"""Add file_data column to document_files table

Revision ID: add_file_data_column
Revises: 
Create Date: 2023-07-01

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_file_data_column'
down_revision = None  # Change this to the last migration in your project
branch_labels = None
depends_on = None


def upgrade():
    # Add file_data column to document_files table
    op.add_column('document_files', sa.Column('file_data', sa.LargeBinary(), nullable=True))
    
    # Make file_path column nullable
    op.alter_column('document_files', 'file_path',
               existing_type=sa.VARCHAR(),
               nullable=True)


def downgrade():
    # Make file_path not nullable again
    op.alter_column('document_files', 'file_path',
               existing_type=sa.VARCHAR(),
               nullable=False)
    
    # Remove file_data column
    op.drop_column('document_files', 'file_data') 