
import React from 'react';
import type { SocialIconName, FloatingIconName, IconSetting } from '../../types';

export const SunIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

export const MoonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

export const AdminIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const TwitterIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.293 1.635 4.21 3.823 4.649-.537.146-1.125.168-1.722.064.616 1.947 2.443 3.364 4.604 3.403-1.78 1.393-4.032 2.223-6.467 2.223-.42 0-.834-.025-1.242-.073 2.298 1.473 5.023 2.333 7.952 2.333 9.49 0 14.682-7.86 14.682-14.683 0-.224-.005-.447-.014-.67.962-.693 1.798-1.562 2.457-2.54z"/></svg>
);
export const GitHubIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);
export const LinkedInIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);
export const FacebookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>
);
export const InstagramIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.585-.011-4.85-.069c-3.225-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919.58-.027 1.13-.042 2.65-.058zM12 0C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98C23.986 15.667 24 15.26 24 12s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
);
export const YouTubeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
);
export const DribbbleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.065 21.84c-2.321 0-4.398-.75-6.14-2.028.989.155 1.996.248 3.033.248 4.675 0 8.527-3.238 9.535-7.534-1.859 3.968-5.835 6.77-10.428 7.066-1.55.099-3.085-.13-4.505-.533.435.15.88.272 1.335.367 1.83.385 3.735.584 5.7.584.033 0 .065 0 .099-.001a9.92 9.92 0 01-.528.001zm-5.46-3.834c.732.483 1.545.86 2.41 1.114.935-.85 1.62-1.92 1.983-3.134-2.583-.4-4.85-2.05-6.28-4.36.033.21.066.413.099.626 1.056 3.6 4.065 6.28 7.62 6.883-.35.033-.693.066-1.036.066-1.122 0-2.21-.165-3.22-.494zm9.364-12.006c-1.022 2.8-3.398 4.98-6.345 5.97-1.485-.693-2.8-1.782-3.83-3.2-1.287-1.78-1.98-3.86-1.914-6.037.957-.165 1.913-.265 2.899-.265 2.474 0 4.78.792 6.69 2.165-2.08-1.253-4.552-1.98-7.225-1.98-.3 0-.6.033-.89.065.3-.925.792-1.782 1.45-2.54.495-.56 1.056-1.056 1.683-1.485 5.51 1.253 9.33 6.25 9.33 11.945 0 .463-.033.925-.099 1.385-1.155-2.738-3.266-5.048-5.94-6.433z"/></svg>
);
export const BehanceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 7h-7v-2h7v2zm-13.342 6.07c.28-.433.422-.925.422-1.474 0-1.7-.959-2.596-2.946-2.596h-4.134v10h4.336c2.429 0 3.629-1.348 3.629-3.414 0-1.313-.6-2.28-1.307-2.516zm-3.332-2.07h-1.328v3.839h1.127c1.372 0 1.946-.662 1.946-1.928 0-1.144-.543-1.911-1.745-1.911zm1.536 6.002c0 1.313-.739 2.056-2.143 2.056h-1.396v-4.11h1.49c1.619 0 2.049.738 2.049 2.054zm9.138-6.002h-5v1h5v-1z"/></svg>
);
export const TikTokIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.01.96-.02 1.92-.02 2.88.02 1.66.24 3.32.69 4.96-1.53.05-3.07.1-4.6-.02-1.26-.08-2.52-.31-3.75-.72-.12-1.54-.53-3.05-.98-4.52-.45-1.45-.96-2.92-1.42-4.38-.21-1.7-.22-3.4-.02-5.1.52-1.68 1.36-3.29 2.49-4.76 1.05-1.35 2.4-2.42 3.91-3.18.33-.16.66-.3.99-.41.01-.06.02-.12.02-.18z"/></svg>
);
export const PinterestIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 .992.371 1.931.82 2.472l.2.215C9.7 14.152 9.5 14.897 9.3 15.641c-.199.75-.42 1.446-.624 2.01.183-.07.369-.141.558-.225 1.136-.412 1.597-.939 1.597-2.234 0-1.554-1.299-2.873-1.299-4.502 0-2.012 1.467-3.693 3.93-3.693 2.127 0 3.323 1.519 3.323 3.196 0 2.218-1.045 4.314-2.613 4.314-.823 0-1.523-.74-1.299-1.633.246-.994.88-2.122.88-2.892 0-.853-.475-1.524-1.334-1.524-.967 0-1.745.993-1.745 2.228 0 .863.332 1.776.745 2.296.083.105.091.168.069.268-.028.129-.112.439-.157.629-.05.21-.115.39-.23.53-2.012.332-3.323-1.633-3.323-3.546 0-2.41 1.835-4.437 5.181-4.437 2.859 0 4.968 2.029 4.968 4.928 0 2.897-1.859 5.29-4.433 5.29-1.292 0-2.458-.932-2.133-2.035.344-1.151.916-2.529.916-3.399 0-1.041-.532-1.928-1.545-1.928-1.258 0-2.251 1.259-2.251 2.809 0 1.259.612 2.412 1.342 3.119-1.845 2.913-1.391 7.216.452 8.643.083.033.157.069.246.105.359.141.737.268 1.122.369.967.246 2.012.398 3.082.398 3.489 0 6.631-1.983 8.3-4.912.168-.283.283-.584.398-.897.168-1.041.267-2.145.267-3.275 0-3.797-2.218-7.143-6.242-7.143z"/></svg>
);
export const DiscordIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v16.092c0 1.368-1.104 2.472-2.46 2.472h-15.08c-1.356 0-2.46-1.104-2.46-2.472v-16.092c0-1.368 1.104-2.472 2.46-2.472h15.08zm-9.54 4.566c-1.104 0-2 .894-2 2s.896 2 2 2 2-.894 2-2-.896-2-2-2zm-4 0c-1.104 0-2 .894-2 2s.896 2 2 2 2-.894 2-2-.896-2-2-2zm8 0c-1.104 0-2 .894-2 2s.896 2 2 2 2-.894 2-2-.896-2-2-2zm-1.54 12s.888-.54 1.54-1.2c-1.452-.24-2.352-.84-2.352-.84s-.6.48-1.44.84c-2.424 1.2-5.604 1.2-5.604 1.2s-1.08-1.2-1.08-2.4c0-2.592 3.216-4.536 3.216-4.536s-.192.54-.456.96c-1.452.24-2.4.6-2.4.6s.6-1.08 1.08-1.92c.384-.768.624-1.2.624-1.2s3.864-1.464 6.744 0c.24.12.384.24.384.24s.24.432.624 1.2c.48.84 1.08 1.92 1.08 1.92s-.96-.36-2.4-.6c-.264-.42-.456-.96-.456-.96s3.216 1.944 3.216 4.536c0 1.2-1.08 2.4-1.08 2.4z"/></svg>
);
export const VimeoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 6.333c-1.125 2.103-3.056 3.996-5.789 5.679-2.502.969-4.83 1.454-6.981 1.454-1.442 0-2.618-.465-3.528-1.393-.91-.929-1.365-2.093-1.365-3.493 0-.64.126-1.216.377-1.728.251-.513.626-.9.124-1.163-.497-.263-1.002-.395-1.514-.395-.42 0-.795.078-1.126.234-.33.156-.541.345-.631.567-.09.222-.099.531-.027.929.189.969.579 1.848 1.17 2.637.591.789 1.22 1.464 1.884 2.025.664.561 1.319.996 1.964 1.305 1.5.719 3.018 1.078 4.557 1.078 2.483 0 4.633-1.008 6.449-3.024 1.816-2.016 2.725-4.577 2.725-7.683v-2.31c-.3.263-.618.522-.954.777-.336.255-.664.483-.981.684zm-16.142-3.876c.498 0 .918.171 1.254.513.336.342.504.81.504 1.404 0 .748-.24 1.362-.719 1.842-.479.48-.996.72-1.551.72-.555 0-1.034-.24-1.439-.72s-.607-1.104-.607-1.842c0-1.02.438-1.755 1.311-2.205.873-.45 1.889-.675 3.047-.675.252 0 .498.003.738.009.24.006.453.018.638.036-.348-.813-.807-1.47-1.377-1.971-.569-.501-1.254-.752-2.053-.752-.618 0-1.192.174-1.719.522s-.918.849-1.17 1.499c-.251.651-.377 1.374-.377 2.172 0 .762.131 1.464.395 2.106.263.642.585 1.206.966 1.692.38.486.786.885 1.215 1.194.43.309.837.525 1.221.648.513.168 1.023.252 1.53.252.748 0 1.439-.213 2.072-.638.633-.426 1.083-.996 1.35-1.71.266-.714.399-1.59.399-2.628v-1.365c-.861-.09-1.725-.135-2.592-.135-1.284 0-2.26.195-2.928.585z"/></svg>
);
export const TelegramIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 8.24l-2.08 9.773c-.22.992-1.242 1.23-1.983.782l-4.5-3.328-2.18 2.102c-.22.22-.44.44-.78.44l.32-4.58 8.76-8.24c.36-.32-.08-.5- .52-.18l-10.74 6.74-4.52-1.403c-1.02-.31-1.04-1.02.2-1.5l15.96-5.96c.78-.28 1.46.32 1.2.98z"/></svg>
);


export const WarningIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
);

export const WhatsAppIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.847 6.062l-1.07 3.912 3.912-1.071z"/>
        <path d="M8.228 7.294c-.225-.488-.47-.502-.683-.51-.212-.008-.447-.008-.682 0-.235.008-.617.099-.935.417-.318.318-.542.779-.542 1.495s.542 1.733.616 1.851c.073.118 1.144 1.832 2.798 2.585 1.654.753 2.156.918 2.664.918.508 0 .979-.092 1.134-.143.155-.051.682-.278.779-.542.098-.264.098-.513.073-.542s-.098-.073-.223-.134c-.125-.061-.682-.33-.79-.379-.108-.049-.182-.073-.264.073-.082.147-.225.29-.276.329-.051.04-.102.048-.177 0s-.302-.11-.577-.338c-.275-.228-.462-.513-.513-.577s-.051-.098 0-.147c.051-.051.112-.135.162-.197.051-.061.074-.124.124-.207.051-.082.025-.156-.013-.207s-.225-.539-.302-.731c-.078-.192-.157-.168-.225-.168z"/>
    </svg>
);

export const BotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 001.84 1.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-1.84 1.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-1.84-1.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 001.84-1.84l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a6.75 6.75 0 003.28 3.28l1.036.258a.75.75 0 010 1.456l-1.036.258a6.75 6.75 0 00-3.28 3.28l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a6.75 6.75 0 00-3.28-3.28l-1.036-.258a.75.75 0 010-1.456l1.036-.258a6.75 6.75 0 003.28-3.28l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.558l.398 1.188a2.25 2.25 0 001.423 1.423l1.188.398a.75.75 0 010 1.424l-1.188.398a2.25 2.25 0 00-1.423 1.423l-.398 1.188a.75.75 0 01-1.424 0l-.398-1.188a2.25 2.25 0 00-1.423-1.423l-1.188-.398a.75.75 0 010-1.424l1.188.398a2.25 2.25 0 001.423-1.423l.398-1.188A.75.75 0 0116.5 15z" clipRule="evenodd" />
    </svg>
);

export const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

export const InnovationIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293c.63.63.184 1.707-.707 1.707H13V5c0-1.105.895-2 2-2zM12 21l-2.293-2.293c-.63-.63-.184-1.707.707-1.707H11v-4c0 1.105-.895 2-2 2zM5 12l2.293-2.293c.63-.63 1.707-.184 1.707.707V11H5zM21 12l-2.293 2.293c-.63-.63-1.707.184-1.707-.707V13h4z" />
    </svg>
);
export const QualityIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const PartnershipIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
export const ExternalLinkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

export const ArrowUpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
);

export const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const LightbulbIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);
export const UsersGroupIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
export const ShieldCheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l4.162-4.162m6.376 0l4.162 4.162a12.02 12.02 0 00-10.538-10.538L12 10.583l2.47-2.47z" />
    </svg>
);

export const EnvelopeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);
export const PhoneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.211-.992-.58-1.355l-3.116-3.117a2.25 2.25 0 00-3.182 0l-.63.63a2.25 2.25 0 01-3.182 0l-4.04-4.04a2.25 2.25 0 010-3.182l.63-.63a2.25 2.25 0 000-3.182L6.44.882A2.25 2.25 0 006.023.25H4.5A2.25 2.25 0 002.25 2.5v4.25z" />
    </svg>
);
export const MapPinIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

export const SocialIcon: React.FC<{ name: SocialIconName }> = ({ name }) => {
    switch (name) {
        case 'Twitter': return <TwitterIcon />;
        case 'GitHub': return <GitHubIcon />;
        case 'LinkedIn': return <LinkedInIcon />;
        case 'Facebook': return <FacebookIcon />;
        case 'Instagram': return <InstagramIcon />;
        case 'YouTube': return <YouTubeIcon />;
        case 'Dribbble': return <DribbbleIcon />;
        case 'Behance': return <BehanceIcon />;
        case 'TikTok': return <TikTokIcon />;
        case 'Pinterest': return <PinterestIcon />;
        case 'Discord': return <DiscordIcon />;
        case 'Vimeo': return <VimeoIcon />;
        case 'Telegram': return <TelegramIcon />;
        default: return null;
    }
};

// New icons for floating buttons
export const MessageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const SupportIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ChatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
);

export const QuestionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.102-.345 2.133-.943 2.943-.598.81-1.47 1.4-2.43 1.772v.285c0 .345-.224.625-.5.625h-2c-.276 0-.5-.28-.5-.625v-.285c-.96-.372-1.832-.962-2.43-1.772C4.345 13.133 4 12.102 4 11c0-2.21 1.79-4 4-4h.228zM12 18h.01" />
    </svg>
);

export const FloatingButtonIcon: React.FC<{ name: FloatingIconName }> = ({ name }) => {
    switch (name) {
        case 'WhatsApp': return <WhatsAppIcon />;
        case 'Bot': return <BotIcon />;
        case 'ArrowUp': return <ArrowUpIcon />;
        case 'Message': return <MessageIcon />;
        case 'Support': return <SupportIcon />;
        case 'Chat': return <ChatIcon />;
        case 'Question': return <QuestionIcon />;
        default: return null;
    }
};

export const CustomIcon: React.FC<{ setting: IconSetting; className?: string }> = ({ setting, className }) => {
    if (setting.type === 'url' && typeof setting.value === 'string' && setting.value) {
        return <img src={setting.value} alt="Custom floating icon" className={className || 'h-8 w-8 object-contain'} />;
    }
    
    if (setting.type === 'pre-built' && typeof setting.value === 'string') {
        return <FloatingButtonIcon name={setting.value as FloatingIconName} />;
    }

    // Fallback to a default icon if something is wrong.
    return <BotIcon />;
};
