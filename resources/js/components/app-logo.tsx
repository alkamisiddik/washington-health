import AppLogoIcon from './app-logo-icon';

const appName = import.meta.env.VITE_SHORT_APP_NAME || 'Laravel';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-2xl">
                <span className="mb-0.5 truncate leading-tight font-bold">{appName}</span>
            </div>
        </>
    );
}
