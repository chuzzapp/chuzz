import { Component } from '@angular/core';

import { TermsPage } from '../../pages/terms/terms';
import { PrivacyPage } from '../../pages/privacy/privacy';


@Component({
  selector: 'agreement-text',
  templateUrl: 'agreement-text.html'
})
export class AgreementTextComponent {

  termPage = TermsPage;
  privacyPage = PrivacyPage;


  constructor() {
    console.log('Hello AgreementTextComponent Component');
  }

}
