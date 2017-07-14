const translate = language => {
  switch (language) {
    case 'en':
      return {
        INTRO_SLIDE_1: 'Welcome to the Suggestion Box!',
        INTRO_SLIDE_2: 'Anonymously submit feedback for your community...',
        INTRO_SLIDE_3: "...and prioritize other members' feedback by voting.",
        INTRO_SLIDE_4: 'Top feedback will either be addressed or receive an official response',
        SUBMIT_FEEDBACK: 'Submit Feedback',
        POSITIVE_FILL_TEXT: 'Positives: What is something that positively contributed to sales and conversation?',
        NEGATIVE_FILL_TEXT: 'Negatives: What is something that negatively impacted sales and conversation?',
        ALL_FEEDBACK: 'All Feedback',
        INVITE_OTHERS: 'Invite others',
        INVITE_OTHERS_BODY: 'Help others in your community voice their feedback through Suggestion Box.',
        SHARE: 'Share',
        DISMISS: 'Dismiss',
        PROPOSED_SOLUTIONS: 'Proposed Solutions',
        NEW_FEEDBACK: 'New Feedback',
        MOST_POPULAR: 'Most popular',
        THIS_WEEK: 'This week',
        TODAY: 'Today',
        MY_FEEDBACK: 'My Feedback',
        ENTER_EMAIL: 'Enter Your Email Address',
        SEND_EMAIL: 'Send Authorization Email',
        EMAIL_BLURB_FOR_CODE: 'Great! We sent an email with a 4-digit code to',
        ENTER_CODE: 'Enter Code from Email',
        VERIFY_EMAIL: 'Verify Email',
        GROUP_DESCRIPTION: "Please enter your organization's unique group code to join your organization.",
        GROUP_CODE: 'Your Group Code',
        JOIN_GROUP: 'Join Group',
        TEXT_INTRO: 'Join me on Suggestion Box!\n\nGROUP CODE: ',
        ENTER_FEEDBACK: 'Enter your feedback here!',
        SIGN_OUT: 'Sign Out'

      }
    case 'es':
      return {
        INTRO_SLIDE_1: 'Bienvenido a The Suggestion Box \n (Caja de sugerencias)',
        INTRO_SLIDE_2: 'Envia Sugerencias para tu comunidad anónimamente ...',
        INTRO_SLIDE_3: "...y prioriza otras sugerencias votando.",
        INTRO_SLIDE_4: 'Las Sugerencias mas priorizadas, las solucionaremos y recibiran una respuesta oficial',
        SUBMIT_FEEDBACK: 'Da Sugerencias ',
        POSITIVE_FILL_TEXT: 'Positivo: Que es algo que contribuyo, en forma positiva, a ventas y conversacion?',
        NEGATIVE_FILL_TEXT: 'Negatvio: Que es algo que contribuyo, en forma positiva, a ventas y conversacion?',
        ALL_FEEDBACK: 'Todas las Sugerencias',
        INVITE_OTHERS: 'Invita a otros',
        INVITE_OTHERS_BODY: 'Ayuda a otros en tu comunidad a dar Sugerencias en The Suggestion Box.',
        SHARE: 'Comparte',
        DISMISS: 'Ignorar',
        PROPOSED_SOLUTIONS: 'Soluciones propuestas',
        NEW_FEEDBACK: 'Nuevas Sugerencias',
        MOST_POPULAR: 'Mas popular',
        THIS_WEEK: 'Esta semana',
        TODAY: 'Hoy',
        MY_FEEDBACK: 'Mis Sugerencias',
        ENTER_EMAIL: 'Escribe su correo electrónico',
        SEND_EMAIL: 'Manda correo de autorización',
        EMAIL_BLURB_FOR_CODE: 'Listo! Le mandamos un correo con una contraseña de 4 números a',
        ENTER_CODE: 'Escribe la contraseña',
        VERIFY_EMAIL: 'Verifica su correo electrónico',
        GROUP_DESCRIPTION: 'Escriba la contraseña de su empresa para collaborar con las sugerencias de su organización',
        GROUP_CODE: 'Contraseña de su empresa',
        JOIN_GROUP: 'Unirse al grupo',
        ENTER_FEEDBACK: 'Enter your feedback here!',
        TEXT_INTRO: 'Join me on Suggestion Box!\n\nGROUP CODE: ',
        SIGN_OUT: 'Sign Out'
      }
    case 'vi':
      return null;
    case 'cn-zh':
      return null;
    }
}

export default translate;
