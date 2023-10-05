import {create} from 'zustand';

export const useRegisterModal = ((set) => ({
	isOpen : false, 
	onOpen : () => set({ isOpen : true}), 
	onClose : () => set({ isOpen : false})
}))

