import React, { useEffect, useState } from 'react';

// CSS
import './editProfile.css';

// React MUI
import Tab from '@mui/material/Tab';
import { TabContext, TabList } from '@mui/lab';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

function EditProfile() {
    // States
    const [tabValue, setTabValue] = useState('Edit')

    // Global States
    const userData = useSelector((state: RootState) => state.auth.userData);
    console.log(userData, 'damn')

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <div className='editProfile-wrapper'>

            <div className='editProfile-view-wrapper'>
                <TabContext value={tabValue}>
                    <div style={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="Tabs" sx={{ '& .MuiTabs-indicator': { display: 'none',}, }}>
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

            <div className='editProfile-card-wrapper'>
                {tabValue==='Edit' ? (
                    <div className='editProfile-edit-wrapper'>
                        edit card here
                    </div>
                ) : (
                    <div className='editProfile-preview-wrapper'>
                        preview card here
                    </div>
                )}
            </div>

            {tabValue==='Edit' && (
                <div className='editProfile-save-wrapper'>
                    <button className='editProfile-save-button'> Save </button>
                </div>
            )}
        </div>
    );
}

export default EditProfile;
