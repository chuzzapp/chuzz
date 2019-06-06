
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { DatetimePickerModule } from 'ion-datetime-picker-sn';
import { Storage, IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { SettingsPage } from '../pages/settings/settings';
import { ProfileFormPage } from '../pages/profile-form/profile-form';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { TopicsPage } from '../pages/topics/topics';
import { TermsPage } from '../pages/terms/terms';
import { AboutPage } from '../pages/about/about';
import { ChuzzHeaderPage } from '../pages/chuzz-header/chuzz-header';
import { PollListPage } from '../pages/poll-list/poll-list';
import { PollPage } from '../pages/poll/poll';
import { ChuzzMessagePage } from '../pages/chuzz-message/chuzz-message';
import { GroupsPage } from '../pages/groups/groups';
import { GroupDetailPage } from '../pages/group-detail/group-detail';
import { AddGroupPage } from '../pages/add-group/add-group';
import { GroupMembersPage } from '../pages/group-members/group-members';
import { GroupPollsListPage } from '../pages/group-polls-list/group-polls-list';
import { ProfilePage } from '../pages/profile/profile';
import { PollQuestionPage } from '../pages/poll-question/poll-question';
import { PollFormPage } from '../pages/poll-form/poll-form';
import { AddGroupMemberPage } from '../pages/add-group-member/add-group-member';
import { GroupChuzzPage } from '../pages/group-chuzz/group-chuzz';
import { GroupPollsPopoverPage } from '../pages/group-polls-popover/group-polls-popover';
import { GroupMembersPopoverPage } from '../pages/group-members-popover/group-members-popover';
import { ProfilePollsPage } from '../pages/profile-polls/profile-polls';
import { ValidatePage } from '../pages/validate/validate';
import {ValidateNumberPage} from '../pages/validate-number/validate-number'
import { PrivacyPage } from '../pages/privacy/privacy';
import { UserWelcomePage } from '../pages/user-welcome/user-welcome';
import { ChuzzQuestionImagePage} from '../pages/chuzz-question-image/chuzz-question-image';
import { NotificationsPage } from '../pages/notifications/notifications';
import { UserCertificatePage } from '../pages/user-certificate/user-certificate';
import { CelebrityListPage } from '../pages/celebrity-list/celebrity-list'; 
import { ImagePickerPage } from '../pages/image-picker/image-picker';


import { Api } from '../providers/api';
import { User } from '../providers/user';

import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Contacts } from '@ionic-native/contacts';
import { AdMobFree } from '@ionic-native/admob-free';
import { ImagePicker } from '@ionic-native/image-picker';
import { Push } from '@ionic-native/push';
import { Crop } from '@ionic-native/crop';
import { InAppBrowser} from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TopicsProvider } from '../providers/topics/topics';
import { TermsProvider } from '../providers/terms/terms';
import { PollProvider } from '../providers/poll/poll';
import { GroupProvider } from '../providers/group/group';
import { PollChoiceComponent } from '../components/poll-choice/poll-choice';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { NotificationProvider } from '../providers/notification/notification';
import { PollGroupComponent } from '../components/poll-group/poll-group';
import { AddQuestionComponent } from '../components/add-question/add-question';
import { InstragramProvider } from '../providers/instragram/instragram';
import { TextAvatarDirective } from '../directives/text-avatar/text-avatar';
import { GroupHeaderComponent } from '../components/group-header/group-header';
import { MessagesProvider } from '../providers/messages/messages';
import { ColorGenerator } from '../directives/text-avatar/color-generator';
import { GroupSingleResultComponent } from '../components/group-single-result/group-single-result';
import { UserProvider } from '../providers/user/user';
import { BaseInfoProvider } from '../providers/base-info/base-info';
import { AgreementTextComponent } from '../components/agreement-text/agreement-text';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { TimeUtilsProvider } from '../providers/time-utils/time-utils';
import { ParamProvider } from '../providers/param/param';
import { DisallowSpacesDirective } from '../directives/disallow-spaces/disallow-spaces';
import { AlphanumericOnlyDirective } from '../directives/alphanumeric-only/alphanumeric-only';
import { CelebrityProvider } from '../providers/celebrity/celebrity';

import { ImageCropperComponent } from 'ngx-image-cropper';
import { DoubleTapDirective } from '../directives/double-tap/double-tap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { GroupEditPage } from '../pages/group-edit/group-edit';
import { PollCardListComponent } from '../components/poll-card-list/poll-card-list';
import { NgDatepickerModule } from 'ng2-datepicker';
import {UserRankingPage} from '../pages/user-ranking/user-ranking';
import {ChatroomPage} from '../pages/chatroom/chatroom';
import {ConversationListPage} from '../pages/conversation-list/conversation-list';
import { File } from '@ionic-native/file';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SelectSearchableModule } from 'ionic-select-searchable';
import {ReferredPage} from '../pages/referred/referred'
import { SMS } from '@ionic-native/sms';
import { IonicImageLoader } from 'ionic-image-loader';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { IonicSelectableModule } from 'ionic-selectable';
//import { UserAgent } from '@ionic-native/user-agent';
import { Device } from '@ionic-native/device';
import { ChuzzonProvider } from '../providers/chuzzon/chuzzon';
import {ItemDetailsPageCommentModule} from '../pages/item-details-comment/item-details-comment.module';
import {ItemDetailsPageFormeModule} from '../pages/item-details-form/item-details-form.module';
import { PusherServiceProvider } from '../providers/pusher-service/pusher-service';
import { CommentsProvider } from '../providers/comments/comments';

//import {IService} from '../providers/service/IService';
//import { Deeplinks } from '@ionic-native/deeplinks';



// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MenuPage,
    SettingsPage,
    ProfileFormPage,
    TabsPage,
    TutorialPage,
    WelcomePage,
    TopicsPage,
    TermsPage,
    AboutPage,
    ChuzzHeaderPage,
    PollListPage,
    PollPage,
    ChuzzMessagePage,
    GroupsPage,
    GroupDetailPage,
    AddGroupPage,
    GroupMembersPage,
    GroupPollsListPage,
    ProfilePage,
    PollQuestionPage,
    PollChoiceComponent,
    ProgressBarComponent,
    PollGroupComponent,
    PollFormPage,
    AddQuestionComponent,
    AddGroupMemberPage,
    TextAvatarDirective,
    GroupHeaderComponent,
    GroupPollsPopoverPage,
    GroupChuzzPage,
    GroupMembersPopoverPage,
    GroupSingleResultComponent,
    ProfilePollsPage,
    ValidatePage,
    ValidateNumberPage,
    PrivacyPage,
    AgreementTextComponent,
    UserWelcomePage,
    ChuzzQuestionImagePage,
    NotificationsPage,
    UserCertificatePage,
    DisallowSpacesDirective,
    AlphanumericOnlyDirective,
    CelebrityListPage,
    ImagePickerPage,
    ImageCropperComponent,
    DoubleTapDirective,
    GroupEditPage,
    PollCardListComponent,
    UserRankingPage,
    ReferredPage,
    ChatroomPage,
    ConversationListPage,
    //ItemDetailsPageComment
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicImageLoader,
    IonicImageLoader.forRoot(),
    SelectSearchableModule,
    IonicSelectableModule,
    NgDatepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true
    }),
    IonicStorageModule.forRoot(),
    DatetimePickerModule,
    OrderModule,
    FilterPipeModule,
    ItemDetailsPageCommentModule,
    ItemDetailsPageFormeModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MenuPage,
    SettingsPage,
    ProfileFormPage,
    TabsPage,
    TutorialPage,
    WelcomePage,
    TopicsPage,
    TermsPage,
    AboutPage,
    ChuzzHeaderPage,
    PollListPage,
    PollPage,
    ChuzzMessagePage,
    GroupsPage,
    GroupDetailPage,
    AddGroupPage,
    GroupMembersPage,
    GroupPollsListPage,
    ProfilePage,
    PollQuestionPage,
    PollFormPage,
    AddGroupMemberPage,
    GroupPollsPopoverPage,
    GroupChuzzPage,
    GroupMembersPopoverPage,
    ProfilePollsPage,
    ValidatePage,
    ValidateNumberPage,
    PrivacyPage,
    UserWelcomePage,
    ChuzzQuestionImagePage,
    NotificationsPage,
    UserCertificatePage,
    CelebrityListPage,
    ImagePickerPage,
    GroupEditPage,
    UserRankingPage,
    ReferredPage,
    ChatroomPage,
    ConversationListPage,
    //ItemDetailsPageComment

  ],
  providers: [
    Api,
    User,
    Camera,
    File,
    AndroidPermissions,
    GoogleMaps,
    SplashScreen,
    PhotoViewer,
    SMS,
    //UserAgent,
    Device,
    StatusBar,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    TopicsProvider,
    TermsProvider,
    PollProvider,
    GroupProvider,
    NotificationProvider,
    InstragramProvider,
    AdMobFree,
    Contacts,
    MessagesProvider,
    ColorGenerator,
    UserProvider,
    BaseInfoProvider,
    LocalStorageProvider,
    ImagePicker,
    NotificationProvider,
    TimeUtilsProvider,
    ParamProvider,
    Push,
    CelebrityProvider,
    Crop,
    InAppBrowser,
    SocialSharing,
    ChuzzonProvider,
    PusherServiceProvider,
    CommentsProvider,
    //IService,
    //Deeplinks
  ]
})
export class AppModule { }
