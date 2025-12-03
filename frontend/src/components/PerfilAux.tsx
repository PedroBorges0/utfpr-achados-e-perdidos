// src/components/PerfilAux.tsx
import React from 'react';

// Componente para exibir dados não editáveis
export const DetailRow: React.FC<{ label: string; value: string | null; staticDisplay?: boolean }> = ({ label, value, staticDisplay }) => (
    <div className="p-3 bg-gray-100 rounded-md shadow-sm">
        <p className="font-semibold text-gray-800">{label}:</p>
        <p className="text-gray-600 whitespace-pre-wrap">{value || '---'}</p>
    </div>
);

// Componente para inputs editáveis/visuais
export const InputGroup: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; disabled: boolean; type?: string; placeholder?: string; autocomplete?: string }> = ({ label, name, value, onChange, disabled, type = 'text', placeholder = '', autocomplete = '' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autocomplete}
            className="w-full bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-300 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
    </div>
);