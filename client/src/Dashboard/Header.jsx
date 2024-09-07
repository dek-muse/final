    import React from 'react';
    import { Link } from 'react-router-dom';
    import { useSelector } from 'react-redux';
    import { Avatar, Dropdown } from 'flowbite-react';

    const Header = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <header className="bg-slate-800 border-b-2 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold">
            <Link to='/'> My Website </Link>
            </div>
            <nav>
            <ul className="flex space-x-4">
                <li>
                {currentUser ? (
            <Dropdown
                arrowIcon={false}
                inline
                label={
                <Avatar alt='user' img={currentUser.profilePicture} rounded  className='w-12 h-12 rounded-lg'/>
                }
            >
                <Dropdown.Header>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>
                    {currentUser.email}
                </span>
                </Dropdown.Header>
                <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Link to={'/'}>
                <Dropdown.Item >Sign out</Dropdown.Item>
                </Link>
            </Dropdown>
            ) : (
            <Link to="/singIn" className="bg-slate-500 text-white py-2 px-4 rounded hover:bg-gray-200">
                    Sign In
                </Link>
            )}
                
                </li>
            </ul>
            </nav>
        </div>
        </header>
    );
    };

    export default Header;

