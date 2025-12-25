
import React from 'react';
import { Users } from 'lucide-react';
import { ExpenseUserRole } from '../../types';

interface Props {
    activeUser: ExpenseUserRole;
    setActiveUser: (role: ExpenseUserRole) => void;
}

const UserRoleSwitcher: React.FC<Props> = ({ activeUser, setActiveUser }) => {
    const roles: ExpenseUserRole[] = ['Clerk', 'Approver', 'Disbursing Officer'];
    
    return (
        <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-lg">
            <Users size={14} className="text-zinc-500 ml-2"/>
            {roles.map(role => (
                <button
                    key={role}
                    onClick={() => setActiveUser(role)}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                        activeUser === role ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                >
                    {role}
                </button>
            ))}
        </div>
    );
};

export default UserRoleSwitcher;
