import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { useProjects } from '@/context/ProjectContext';

const StudioDashboard = () => {
  const navigate = useNavigate();
  const { projects, createProject, setCurrentProject } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectClick = (project: typeof projects[0]) => {
    setCurrentProject(project);
    navigate(`/studio/project/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        showBack
        backTo="/"
        title="Studio Dashboard"
        subtitle="Manage your wedding projects"
        rightContent={
          <Button variant="hero" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Project</span>
          </Button>
        }
      />

      <main className="container px-4 md:px-6 py-8">
        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
              <FolderKanban className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {searchQuery ? 'No Projects Found' : 'No Projects Yet'}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first wedding project to get started'}
            </p>
            {!searchQuery && (
              <Button variant="hero" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            )}
          </div>
        )}
      </main>

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createProject}
      />
    </div>
  );
};

export default StudioDashboard;
