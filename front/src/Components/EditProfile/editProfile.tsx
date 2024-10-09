import React, { useEffect, useState } from 'react';

// CSS
import './editProfile.css';

// React MUI
import Tab from '@mui/material/Tab';
import { TabContext, TabList } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';

// Components
import CardProfile from '../CardProfile/cardProfile';

// Sub Components
import EditCard from './subComponents/editCard';

function EditProfile() {
    // States
    const [tabValue, setTabValue] = useState('Edit')
    const [isSaveUpdates, setIsSaveUpdates] = useState(false)

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <div className='editProfile-wrapper'>
            <div className='editProfile-view-wrapper'>
                <TabContext value={tabValue}>
                    <div style={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="Tabs" sx={{ '& .MuiTabs-indicator': { display: 'none', }, }}>
                            <Tab
                                label="Preview"
                                value="Preview"
                                sx={{
                                    color: tabValue === 'Preview' ? '#ff4458' : '#7c8591',
                                    textTransform: 'none',
                                    fontSize: "120%",
                                    borderRadius: '5px',
                                    fontWeight: '600',
                                    '&.Mui-selected': {
                                        color: '#ff4458',
                                    },
                                }}
                            />
                            <Tab
                                label="Edit"
                                value="Edit"
                                sx={{
                                    color: tabValue === 'Edit' ? '#ff4458' : '#7c8591',
                                    textTransform: 'none',
                                    fontSize: "120%",
                                    borderRadius: '5px',
                                    fontWeight: '600',
                                    '&.Mui-selected': {
                                        color: '#ff4458',
                                    }
                                }}
                            />
                        </TabList>
                    </div>
                </TabContext>
            </div>

            <div className={`editProfile-card-wrapper ${tabValue === 'Edit' ? 'editProfile-card-wrapper-edit' : ''}`}>
                {tabValue === 'Edit' ? (
                    <div className='editProfile-edit-wrapper'>
                        <EditCard isSaveUpdates={isSaveUpdates} setIsSaveUpdates={setIsSaveUpdates} />
                    </div>
                ) : (
                    <div className='editProfile-preview-wrapper'>
                        <CardProfile isInEditProfile={true} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditProfile;
