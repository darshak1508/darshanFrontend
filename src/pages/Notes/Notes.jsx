/**
 * Notes Management Page
 * 
 * Interface for creating and managing personal notes.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// API Config
import API from '../../config/api';
import { cachedApiCall } from '../../utils/cachedApiCall';
import { apiCall } from '../../utils/auth';
import { formatDate } from '../../utils/dateFormatter';

// Design System Components
import {
    AppLayout,
    MainContent,
    MobileHeader,
    PageHeader,
    Sidebar,
    SidebarProvider,
    UserProfile,
} from '../../design-system/components/Layout';
import Button from '../../design-system/components/Button';

// Icons
import {
    DashboardIcon,
    BusinessIcon,
    VehicleIcon,
    PaymentIcon,
    ReceiptIcon,
    NoteIcon,
    PlusIcon,
    EditIcon,
    TrashIcon,
    CloseIcon,
    ClockIcon,
} from '../../design-system/icons';

// Styles
import '../../design-system/styles/globals.css';
import './Notes.css';

// Navigation routes
const navigationRoutes = [
    {
        title: 'Main',
        items: [
            { key: 'dashboard', name: 'Dashboard', route: '/dashboard', icon: <DashboardIcon size={18} /> },
            { key: 'firms', name: 'Firms', route: '/firms', icon: <BusinessIcon size={18} /> },
            { key: 'vehicles', name: 'Vehicles', route: '/vehicles', icon: <VehicleIcon size={18} /> },
        ],
    },
    {
        title: 'Business',
        items: [
            { key: 'pricing', name: 'Pricing', route: '/pricing', icon: <PaymentIcon size={18} /> },
            { key: 'transactions', name: 'Transactions', route: '/transactions', icon: <ReceiptIcon size={18} /> },
            { key: 'notes', name: 'Notes', route: '/notes', icon: <NoteIcon size={18} /> },
        ],
    },
];

function Notes() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        Title: '',
        Content: '',
    });

    const [filterDate, setFilterDate] = useState({ start: '', end: '' });

    // Fetch notes
    const fetchNotes = async (forceRefresh = false) => {
        setIsLoading(true);
        try {
            const response = await cachedApiCall(API.NOTE.GET_ALL, {}, { forceRefresh });
            if (response.ok) {
                const data = await response.json();
                // Sort by UpdatedAt desc
                const sortedNotes = data.sort((a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt));
                setNotes(sortedNotes);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Check for auto-open from dashboard
    const { state } = useLocation();
    useEffect(() => {
        if (state?.openCreate) {
            handleOpencreate();
            // Clean up state so it doesn't reopen on refresh (optional, but good practice)
            window.history.replaceState({}, document.title);
        }
    }, [state]);

    // Filter notes
    const filteredNotes = notes.filter((note) => {
        if (!filterDate.start && !filterDate.end) return true;

        const noteDate = new Date(note.UpdatedAt);
        noteDate.setHours(0, 0, 0, 0);

        if (filterDate.start) {
            const startDate = new Date(filterDate.start);
            startDate.setHours(0, 0, 0, 0);
            if (noteDate < startDate) return false;
        }

        if (filterDate.end) {
            const endDate = new Date(filterDate.end);
            endDate.setHours(23, 59, 59, 999);
            if (noteDate > endDate) return false;
        }

        return true;
    });

    const clearFilters = () => setFilterDate({ start: '', end: '' });

    // Open modal for create
    const handleOpencreate = () => {
        setEditingNote(null);
        setFormData({ Title: '', Content: '' });
        setIsModalOpen(true);
    };

    // Open modal for edit
    const handleOpenEdit = (note) => {
        setEditingNote(note);
        setFormData({ Title: note.Title, Content: note.Content });
        setIsModalOpen(true);
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const isEdit = !!editingNote;
            const url = isEdit ? API.NOTE.UPDATE(editingNote.NoteID) : API.NOTE.CREATE;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await cachedApiCall(url, {
                method,
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchNotes(true); // Refresh list
            } else {
                alert('Failed to save note');
            }
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Error saving note');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await apiCall(API.NOTE.DELETE(id), {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchNotes(true);
            } else {
                alert('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <SidebarProvider>
            <AppLayout>
                <MobileHeader
                    brand="Jay GuruDev"
                    brandIcon={<BusinessIcon size={20} />}
                />
                <Sidebar
                    brand="Jay GuruDev"
                    brandIcon={<BusinessIcon size={20} />}
                    routes={navigationRoutes}
                    footer={<UserProfile />}
                />

                <MainContent>
                    <PageHeader
                        title="Notes"
                        subtitle="Capture and reorganize your thoughts and tasks"
                        actions={
                            <Button
                                variant="primary"
                                leftIcon={<PlusIcon size={18} />}
                                onClick={handleOpencreate}
                            >
                                Create Note
                            </Button>
                        }
                    />

                    {/* Filter Toolbar */}
                    <div className="notes-filter-toolbar">
                        <div className="notes-filter-group">
                            <ClockIcon size={16} />
                            <span className="notes-filter-label">Filter by Date:</span>
                        </div>
                        <div className="notes-filter-inputs">
                            <input
                                type="date"
                                className="notes-filter-input"
                                value={filterDate.start}
                                onChange={(e) => setFilterDate(prev => ({ ...prev, start: e.target.value }))}
                                placeholder="Start Date"
                            />
                            <span className="notes-filter-separator">to</span>
                            <input
                                type="date"
                                className="notes-filter-input"
                                value={filterDate.end}
                                onChange={(e) => setFilterDate(prev => ({ ...prev, end: e.target.value }))}
                                placeholder="End Date"
                            />
                            {(filterDate.start || filterDate.end) && (
                                <button className="notes-filter-clear" onClick={clearFilters}>
                                    <CloseIcon size={14} /> Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="notes-loading">Loading notes...</div>
                    ) : filteredNotes.length > 0 ? (
                        <div className="notes-grid">
                            {filteredNotes.map((note) => (
                                <div key={note.NoteID} className="note-card">
                                    <div className="note-card__header">
                                        <h3 className="note-card__title">{note.Title}</h3>
                                        <div className="note-card__actions">
                                            <button
                                                className="note-card__action"
                                                onClick={() => handleOpenEdit(note)}
                                                title="Edit"
                                            >
                                                <EditIcon size={16} />
                                            </button>
                                            <button
                                                className="note-card__action note-card__action--delete"
                                                onClick={() => handleDelete(note.NoteID)}
                                                title="Delete"
                                            >
                                                <TrashIcon size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="note-card__content">
                                        {note.Content}
                                    </div>
                                    <div className="note-card__footer">
                                        <ClockIcon size={14} />
                                        <span>Updated {formatDate(note.UpdatedAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="notes-empty">
                            <div className="notes-empty__icon">
                                <NoteIcon size={40} />
                            </div>
                            <h3 className="notes-empty__title">No notes yet</h3>
                            <p className="notes-empty__description">
                                Create your first note to keep track of important information.
                            </p>
                            <Button
                                variant="primary"
                                leftIcon={<PlusIcon size={18} />}
                                onClick={handleOpencreate}
                            >
                                Create First Note
                            </Button>
                        </div>
                    )}

                    {/* Create/Edit Modal */}
                    {isModalOpen && (
                        <div className="note-modal-overlay" onClick={() => setIsModalOpen(false)}>
                            <div className="note-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="note-modal__header">
                                    <h3 className="note-modal__title">
                                        {editingNote ? 'Edit Note' : 'Create New Note'}
                                    </h3>
                                    <button className="note-modal__close" onClick={() => setIsModalOpen(false)}>
                                        <CloseIcon size={20} />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="note-modal__body">
                                        <div className="note-form-group">
                                            <label className="note-form-label">Title</label>
                                            <input
                                                type="text"
                                                className="note-form-input"
                                                placeholder="Note title"
                                                value={formData.Title}
                                                onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                        <div className="note-form-group">
                                            <label className="note-form-label">Content</label>
                                            <textarea
                                                className="note-form-input note-form-textarea"
                                                placeholder="Write your note content here..."
                                                value={formData.Content}
                                                onChange={(e) => setFormData({ ...formData, Content: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="note-modal__footer">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            loading={isSubmitting}
                                            disabled={!formData.Title.trim() || !formData.Content.trim()}
                                        >
                                            {editingNote ? 'Update Note' : 'Create Note'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </MainContent>
            </AppLayout>
        </SidebarProvider>
    );
}

export default Notes;
