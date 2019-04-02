import { PollListPage } from './poll-list/poll-list';
import { TabsPage } from './tabs/tabs';
import { GroupsPage } from './groups/groups';
import { ProfileFormPage } from './profile-form/profile-form';
import { WelcomePage } from './welcome/welcome';
import { NotificationsPage } from './notifications/notifications';
import {ConversationListPage} from './conversation-list/conversation-list';

// The page the user lands on after opening the app and without a session
export const FirstRunPage = WelcomePage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = PollListPage;
export const Tab2Root = PollListPage;
export const Tab3Root = PollListPage;
export const Tab4Root = PollListPage;
export const Tab5Root = GroupsPage;
export const Tab6Root = NotificationsPage;
export const Tab7Root = ConversationListPage;
