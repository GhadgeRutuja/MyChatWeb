import title from './title.png';
import bg from './bg.jpg';
import bgImage2 from './bgImage2.jpg';
import menu_icon from './menu_icon.png';
import logo from './logo.png';
import search_icon from './search_icon.png';
import avatar_icon from './avatar_icon.png';
import MyChat from './MyChat.jpg';
import bg3 from './bg3.jpg';

const assets = {
    title,
    bg,
    bgImage2,
    logo,
    menu_icon,
    search_icon,
    avatar_icon,
    MyChat,
    bg3
};

export default assets;

export const userDummyData = [
    {
        "_id": "680f50aaf10f3cd28382ecf2",
        "email": "user1@gmail.com",
        "fullName": "User One",
        "profilePic": null, // or a valid image path if you have one
        "bio": "This is user one bio",
    },
    {
        "_id": "680f50aaf10f3cd28382ecf3",
        "email": "abcd@gmail.com",
        "fullName": "User Two", 
        "profilePic": null, // or a valid image path if you have one
        "bio": "This is user two bio"
    }
]

export const messagesDummyData = [
    {
        "_id": "680f50aaf10f3cd28382ecf2",
        "senderId": "680f50aaf10f3cd28382ecf2",
        "receiverId": "680f50aaf10f3cd28382ecf3",
        "text": "Hello, how are you?",
        "seen": true,
        "createdAt": "2023-10-01T12:00:00Z",
    },
    {
        "_id": "680f50aaf10f3cd28382ecf3",
        "senderId": "680f50aaf10f3cd28382ecf3",
        "receiverId": "680f50aaf10f3cd28382ecf2",
        "text": "I'm good, thanks!",
        "seen": true,
        "createdAt": "2023-10-01T12:05:00Z",
    }
]