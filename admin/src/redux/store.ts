import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "@/features/login/adminSlice";
import blogsReducer from "@/features/blog/blogSlice";
import projectsReducer from "@/features/project/projectSlice";
import noteReducer from "@/features/notes/noteSlice";
import bookReducer from "@/features/book/bookSlice";
import productReducer from "@/features/product/productSlice";
import skillReducer from "@/features/skill/skillSlice";
import experienceReducer from "@/features/experience/experienceSlice";
import categoryReducer from "@/features/category/categorySlice";
import certificateReducer from "@/features/certificate/certificateSlice";
import educationReducer from "@/features/education/educationSlice";
import serviceReducer from "@/features/service/serviceSlice";
import contactsReducer from "@/features/contact/contactSlice";
import dashboardReducer from "@/features/dashboard/dashboardSlice";
import settingsReducer from "@/features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    blogs: blogsReducer,
    projects: projectsReducer,
    notes: noteReducer,
    books: bookReducer,
    products: productReducer,
    skills: skillReducer,
    expriences: experienceReducer,
    categories: categoryReducer,
    certificates: certificateReducer,
    educations: educationReducer,
    services: serviceReducer,
    contacts: contactsReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
