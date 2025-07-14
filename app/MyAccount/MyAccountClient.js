"use client"
import { useState, useEffect, useContext } from 'react';
import { User, MapPin, Lock, CreditCard, Bell, Edit2, Save, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import { CartContext } from '../cartContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const MyAccountPage = () => {
    const { data: session, status } = useSession();
    const { userCred } = useContext(CartContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [userEmail, setuserEmail] = useState(null);
    const [userData, setuserData] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    });

    const [addressFormData, setAddressFormData] = useState({
        streetAddress: '',
        city: '',
        stateZip: '',
    });

    const [userAddressParts, setUserAddressParts] = useState([]);

    const router = useRouter();
    const searchParams = useSearchParams();
    const paramEmail = searchParams.get('email');

    useEffect(() => {
        if (paramEmail) setuserEmail(paramEmail);
    }, [paramEmail]);

    useEffect(() => {
        if (userData) {
            const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
            console.log('Parts of Name: ', nameParts);
            setProfileFormData({
                firstName: nameParts[0] || '',
                lastName: nameParts[1] || '',
                phone: userData.phone || '',
            });
            console.log('First name: ', profileFormData.firstName);
            console.log('Last name: ', profileFormData.lastName);
            console.log('phone number : ', profileFormData.phone);

            if (userData.address) {
                const addressParts = userData.address.split("$$");
                setAddressFormData({
                    streetAddress: addressParts[0] ? addressParts[0].trim() : '',
                    city: addressParts[1] ? addressParts[1].trim() : '',
                    stateZip: addressParts[2] ? addressParts[2].trim() : '',
                });
                setUserAddressParts(addressParts.map(part => part.trim()));
            } else {
                setAddressFormData({ streetAddress: '', city: '', stateZip: '' });
                setUserAddressParts([]);
            }


        }
    }, [userData]);

    useEffect(() => {
        if (!userEmail) return;

        const fetchUserDetails = async () => {
            if (userEmail && ((session && session.user) || (userCred && Object.keys(userCred).length > 0))) {
                try {
                    const response = await fetch(`/api/updateUser?email=${userEmail}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();

                    if (data.error) {
                        toast.error(`${data.error}, Please try again later!`);
                    }

                    if (!response.ok) {
                        toast.error(`${data.error || 'Something went wrong'}, Please try again or check your connection.`);
                    }

                    if (response.ok && data) {
                        console.log("Fetched user data:", data);
                        setuserData(data);
                    } else {
                        console.error('Failed to fetch user details:', data);
                        setuserData(null);
                    }

                } catch (error) {
                    console.error('Error fetching user details:', error);
                    toast.error(`Network error: Please check your internet connection and try again.`);
                    setuserData(null);
                }
            } else if (!email) {
                console.warn("Email parameter is missing from URL. Cannot fetch user details.");
            }
        };

        fetchUserDetails();
    }, [userEmail, session, userCred]);


    const handleProfileInputChange = (e) => {

        const { id, value } = e.target;
        setProfileFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };


    const handleAddressInputChange = (e) => {
        const { id, value } = e.target;
        setAddressFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };


    const handleSaveProfileChanges = async () => {
        console.log("Saving profile changes:", profileFormData);
        try {
            const response = await fetch(`/api/updateUser?email=${userEmail}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${profileFormData.firstName} ${profileFormData.lastName}`.trim(),
                    phone: profileFormData.phone,
                    email: session ? session.user.email : userCred.email
                }),
            });
            const result = await response.json();
            if (result.error) {
                toast.error(`${data.error}, Please try again Later!`)
            }
            if (response.ok) {
                console.log('Profile update successful:', result);
                toast.success('Profile update successful!', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,

                });
                setuserData(prevUserData => ({
                    ...prevUserData,
                    name: `${profileFormData.firstName} ${profileFormData.lastName}`.trim(),
                    phone: profileFormData.phone,
                }));
                setIsEditingProfile(false);
            } else {
                console.error('Failed to update profile details:', result);
                toast.error('Profile updation failed!', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Error updating profile details:', error);
            toast.error(`${data.error}, Please try again Later or check you connection.`)
        }
    };


    const handleSaveAddressChanges = async () => {
        console.log("Saving address changes:", addressFormData);
        try {
            const response = await fetch(`/api/updateUser?email=${userEmail}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    address: `${addressFormData.streetAddress}$$${addressFormData.city}$$${addressFormData.stateZip}`,
                }),
            });
            const result = await response.json();
            if (result.error) {
                toast.error(`${data.error}, Please try again Later or check you connection.`)
            }
            if (response.ok) {
                console.log('Address updated successful:', result);
                toast.success('Address updated successful!', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,

                });
                setuserData(prevUserData => ({
                    ...prevUserData,
                    address: `${addressFormData.streetAddress}$$${addressFormData.city}$$${addressFormData.stateZip}`,
                }));
                setIsEditingAddress(false);
            } else {
                console.error('Failed to update address:', result);
                toast.error('Failed to updated address!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,

                });
            }
        } catch (error) {
            console.error('Error updating address:', error);
            toast.error(`${data.error}, Please try again Later or check you connection.`)
        }
    };

    const handleCancelProfileEdit = () => {
        setIsEditingProfile(false);
        if (userData) {
            const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
            setProfileFormData({
                firstName: nameParts[0] || '',
                lastName: nameParts[1] || '',
                phone: userData.phone || '',
            });
        }
    };


    const handleCancelAddressEdit = () => {
        setIsEditingAddress(false);

        if (userData) {
            if (userData.address) {
                const addressParts = userData.address.split("$$");
                setAddressFormData({
                    streetAddress: addressParts[0] ? addressParts[0].trim() : '',
                    city: addressParts[1] ? addressParts[1].trim() : '',
                    stateZip: addressParts[2] ? addressParts[2].trim() : '',
                });
            } else {
                setAddressFormData({ streetAddress: '', city: '', stateZip: '' });
            }
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'payment', label: 'Payment Methods', icon: CreditCard },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ];

    if (status === "loading" || !userData) {
        return (
            <div className='mx-5 my-8 min-h-screen'>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <h1 className='text-2xl font-bold text-center my-5'>My Account</h1>
                <div className='text-center text-lg font-semibold'>Loading user details...</div>
            </div>
        );
    }

    if (!((session && session.user) || (userCred && Object.keys(userCred).length > 0))) {
        return (
            <div className='mx-5 my-8 min-h-screen'>
                <h1 className='text-2xl font-bold text-center my-5'>My Account</h1>
                <div className='text-center text-lg font-semibold'>Please login to continue.</div>
                <div className='flex justify-center mt-5'>
                    <button
                        onClick={() => router.push('/SignIn')}
                        className="bg-[#1f5ec6] text-white px-6 py-3 rounded-lg cursor-pointer"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover

            />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome {session?.user?.name || userCred?.name}
                    </h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <nav className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <div className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                    <button
                                        onClick={() => {
                                            if (isEditingProfile) {
                                                handleCancelProfileEdit();
                                            } else {
                                                setIsEditingProfile(true);
                                            }
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isEditingProfile
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                            }`}
                                    >
                                        {isEditingProfile ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                        {isEditingProfile ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input
                                            onChange={handleProfileInputChange}
                                            value={profileFormData.firstName}
                                            id="firstName"
                                            type="text"
                                            disabled={!isEditingProfile}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input
                                            onChange={handleProfileInputChange}
                                            value={profileFormData.lastName}
                                            id='lastName'
                                            type="text"
                                            disabled={!isEditingProfile}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            value={userData?.email || ''}
                                            type="email"
                                            disabled // Email usually not editable directly here
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <input
                                            onChange={handleProfileInputChange}
                                            value={profileFormData.phone}
                                            id="phone"
                                            type="tel"
                                            disabled={!isEditingProfile}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>

                                {isEditingProfile && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSaveProfileChanges}
                                            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Addresses</h2>
                                    <button
                                        onClick={() => {
                                            if (isEditingAddress) {
                                                handleCancelAddressEdit();
                                            } else {
                                                setIsEditingAddress(true);
                                            }
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isEditingAddress
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                            }`}
                                    >
                                        {isEditingAddress ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                        {isEditingAddress ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                <div className="grid gap-4">
                                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Default Address</h3>
                                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Primary</span>
                                            </div>

                                        </div>

                                        {!isEditingAddress ? (

                                            userAddressParts.length > 0 ? (
                                                userAddressParts.map((item, idx) => (
                                                    <div key={idx} className="text-gray-600 space-y-1">
                                                        <p>{item}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No address found.</p>
                                            )
                                        ) : (

                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                                    <input
                                                        onChange={handleAddressInputChange}
                                                        value={addressFormData.streetAddress}
                                                        id="streetAddress"
                                                        type="text"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter street address"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                                    <input
                                                        onChange={handleAddressInputChange}
                                                        value={addressFormData.city}
                                                        id="city"
                                                        type="text"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter city"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="stateZip" className="block text-sm font-medium text-gray-700 mb-2">State & Zip Code</label>
                                                    <input
                                                        onChange={handleAddressInputChange}
                                                        value={addressFormData.stateZip}
                                                        id="stateZip"
                                                        type="text"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter state and zip code"
                                                    />
                                                </div>
                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={handleSaveAddressChanges}
                                                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        <Save className="cursor-pointer w-4 h-4" />
                                                        Save Address
                                                    </button>

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                        Add Payment Method
                                    </button>
                                </div>
                                <div className="grid gap-4">
                                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">•••• •••• •••• 1234</p>
                                                    <p className="text-sm text-gray-500">Expires 12/26</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-700">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-700">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                                <div className="space-y-4">
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
                                        <p className="text-gray-600 mb-4">
                                            Update your password to keep your account secure.
                                        </p>
                                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                            Change Password
                                        </button>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                                        <p className="text-gray-600 mb-4">Add an extra layer of security to your account.</p>
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                            Enable 2FA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccountPage;
