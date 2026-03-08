import { configureStore } from '@reduxjs/toolkit';
import blogReducer from '@/features/blog/blogSlice';
import projectReducer from '@/features/project/projectSlice';
import productReducer from '@/features/product/productSlice';
import serviceReducer from '@/features/service/serviceSlice';
import bookReducer from '@/features/book/bookSlice';
import certificateReducer from '@/features/certificate/certificateSlice';
import educationReducer from '@/features/education/educationSlice';
import categoryReducer from '@/features/category/categorySlice';
import experienceReducer from '@/features/experience/experienceSlice';
import skillReducer from '@/features/skill/skillSlice';
import noteReducer from '@/features/notes/noteSlice';
import settingsReducer from '@/features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    projects: projectReducer,
    products: productReducer,
    services: serviceReducer,
    books: bookReducer,
    certificates: certificateReducer,
    educations: educationReducer,
    categories: categoryReducer,
    experiences: experienceReducer,
    skills: skillReducer,
    notes: noteReducer,
    settings: settingsReducer,
  },
});
