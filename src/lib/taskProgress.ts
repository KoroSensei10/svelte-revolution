export type Task = {
    taskName: string;
    duration: number;
    subTasks?: Task[];
    completed: boolean;
    inCharge?: string;
}

export const tasks: Task[] = [
    {
        taskName: 'Traduction',
        duration: 5,
        completed: false,
    },
    {
        taskName: 'Admin',
        duration: 0,
        completed: false,
        inCharge: 'Mathis',
        subTasks: [{
            taskName: 'Création de compte',
            duration: 5,
            completed: false
        }, {
            taskName: 'Terminer une session',
            duration: 2,
            completed: false
        },
        {
            taskName: 'Ajouter un événement dans une session',
            duration: 8,
            completed: false
        }, {
            taskName: 'Link les users aux sessions et aux scénarios',
            duration: 8,
            completed: false
        }]
    },
    {
        taskName: 'Graphe',
        duration: 0,
        completed: false,
        inCharge: 'Mathis',
        subTasks: [{
            taskName: 'Voir les messages et les auteurs',
            duration: 4,
            completed: false
        }, {
            taskName: 'Ajouter les sides aux messages',
            duration: 2,
            completed: false
        }, {
            taskName: 'Couleur des noeuds',
            duration: 2,
            completed: false
        }]
    }, {
        taskName: 'Page d\'accueil',
        duration: 0,
        completed: false,
        inCharge: 'Eva',
        subTasks: [{
            taskName: 'Ajouter les dernières sessions',
            duration: 5,
            completed: false
        }, {
            taskName: 'Design',
            duration: 15,
            completed: false
        }]
    }
];