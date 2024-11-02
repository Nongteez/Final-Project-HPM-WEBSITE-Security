
'use client'
import { useState, createContext,useContext, useEffect } from "react";
import { useSession } from "next-auth/react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [allQuiz , setAllQuiz] = useState([])

    const fetchUsers = async () => {
        console.log('Fetching Users'); 
        try {
            const result = await fetch('/api/userscoreView', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: session?.user?.email })
            });
            const data = await result.json();
            setUsers(data);
        } catch (error) {
            console.log(error)
        }
        

    }
    const fetchUserQuiz = async () => {
        console.log('Fetching User Quiz');
        try {
            const result = await fetch('/api/userquizView')
            const data = await result.json()
            setAllQuiz(data)
        } catch (error) {
            console.log(error)
        }

    }
    
    

    return (

        <UserContext.Provider value={{ users, setUsers, fetchUsers,fetchUserQuiz ,allQuiz }}>
            {children}
        </UserContext.Provider>
    )

}

export const useUserContext = () => useContext(UserContext)