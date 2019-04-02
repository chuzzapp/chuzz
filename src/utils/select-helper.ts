export function scrollToSelectedItem(selectButton) {
  // https://github.com/ionic-team/ionic/issues/6356#issuecomment-336220008
  const options: HTMLCollectionOf<Element> = document.getElementsByClassName('alert-tappable alert-radio'); // These classes come from the generated elements for the ion-select/ion-option
  (<any>selectButton._overlay).didEnter.subscribe(
    () => {
      //Give a one cycle delay just to run this just after the didEnter has been called
      setTimeout(() => {
        let i: number = 0
        const len: number = options.length
        for (i; i < len; i++) {
          if ((options[i] as HTMLElement).attributes[3].nodeValue === 'true') {
            let offset = 0;
            if ((len - i - 1) > 2) {
              offset = 2;
            }
            options[i + offset].scrollIntoView({ block: 'end', behavior: 'instant' })
          }
        }
      });
    }
  );
}
