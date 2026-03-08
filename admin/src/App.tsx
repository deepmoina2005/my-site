import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/shared/components/app/DashboardLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ProjectAdd from "@/features/project/pages/ProjectAdd";
import ProjectsLists from "@/features/project/pages/ProjectsLists";
import LoginPage from "@/features/login/pages/LoginPage";
import { ThemeProvider } from "@/shared/components/theme-provider";
import AppToaster from "@/shared/components/AppToaster";
import AddBlog from "@/features/blog/pages/AddBlog";
import AllBlogs from "@/features/blog/pages/AllBlogs";
import ViewBlogDetails from "@/features/blog/pages/ViewBlogDetails";
import EditBlog from "@/features/blog/pages/EditBlog";
import ViewProjectDetails from "@/features/project/pages/ViewProjectDetails";
import EditProject from "@/features/project/pages/EditProject";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import AddNotes from "@/features/notes/pages/addNotes";
import AllNotes from "@/features/notes/pages/allNotes";
import AddBooks from "@/features/book/pages/AddBooks";
import AllBooks from "@/features/book/pages/AllBooks";
import AddProducts from "@/features/product/pages/AddProducts";
import AllProducts from "@/features/product/pages/AllProducts";
import AddSkill from "@/features/skill/pages/AddSkill";
import AllSkills from "@/features/skill/pages/AllSkills";
import AddExperience from "@/features/experience/pages/AddExperience";
import AllExperience from "@/features/experience/pages/AllExperience";
import AddEducation from "@/features/education/pages/AddEducation";
import EditEducation from "@/features/education/pages/EditEducation";
import AllEducations from "@/features/education/pages/AllEducations";
import AddService from "@/features/service/pages/AddService";
import EditService from "@/features/service/pages/EditService";
import AllServices from "@/features/service/pages/AllServices";
import AddCertificate from "@/features/certificate/pages/AddCertificate";
import EditCertificate from "@/features/certificate/pages/EditCertificate";
import AllCertificates from "@/features/certificate/pages/AllCertificates";
import AllContacts from "@/features/contact/pages/AllContacts";
import AllCategories from "@/features/category/pages/AllCategories";
import ViewNoteDetails from "@/features/notes/pages/ViewNoteDetails";
import ViewBooksDetails from "@/features/book/pages/ViewBooksDetails";
import ViewProductDetails from "@/features/product/pages/ViewProductDetails";
import ViewExperienceDetails from "@/features/experience/pages/ViewExprienceDetails";
import SettingsPage from "@/features/settings/pages/SettingsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors">
        <AppToaster />
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="projects/add" element={<ProjectAdd />} />
            <Route path="projects/all" element={<ProjectsLists />} />
            <Route path="projects/:id" element={<ViewProjectDetails />} />
            <Route path="projects/:id/edit" element={<EditProject />} />

            <Route path="blog/add" element={<AddBlog />} />
            <Route path="blog/all" element={<AllBlogs />} />
            <Route path="blog/:slug" element={<ViewBlogDetails />} />
            <Route path="blog/:slug/edit" element={<EditBlog />} />

            <Route path="notes/add" element={<AddNotes />} />
            <Route path="notes/all" element={<AllNotes />} />
            <Route path="notes/:id" element={<ViewNoteDetails />} />

            <Route path="books/add" element={<AddBooks />} />
            <Route path="books/all" element={<AllBooks />} />
            <Route path="books/:id" element={<ViewBooksDetails />} />

            <Route path="products/add" element={<AddProducts />} />
            <Route path="products/all" element={<AllProducts />} />
            <Route path="products/:id" element={<ViewProductDetails />} />

            <Route path="skills/add" element={<AddSkill />} />
            <Route path="skills/all" element={<AllSkills />} />

            <Route path="experience/add" element={<AddExperience />} />
            <Route path="experience/all" element={<AllExperience />} />
            <Route path="experience/:id" element={<ViewExperienceDetails />} />

            <Route path="education/add" element={<AddEducation />} />
            <Route path="education/all" element={<AllEducations />} />
            <Route path="education/:id/edit" element={<EditEducation />} />

            <Route path="certificates/add" element={<AddCertificate />} />
            <Route path="certificates/all" element={<AllCertificates />} />
            <Route path="certificates/:id/edit" element={<EditCertificate />} />

            <Route path="categories/all" element={<AllCategories />} />

            <Route path="services/add" element={<AddService />} />
            <Route path="services/all" element={<AllServices />} />
            <Route path="services/:id/edit" element={<EditService />} />

            <Route path="contact" element={<AllContacts />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;