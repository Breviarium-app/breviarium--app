import {ref} from 'vue';

// Shared so floating elements (e.g. the auto-scroll button) can follow the tabbar when it hides on scroll
const tabbarVisible = ref(true);

export function useTabbarVisibility() {
    return tabbarVisible;
}
