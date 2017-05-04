import { Log, Level } from 'ng2-logger/ng2-logger';
const log = Log.create('Errors');
log.color = 'orange';

export class ErrorsParsingService {
  error: any;
  methods: any = {
    'Not authenticated': this.notAuth
  };

  parse(error) {
    this.error = error;
    return this.methods[this.getErrorMethod()]();
  }

  getErrorMethod() {
    let title = this.error.title;
    title = title.toLowerCase().replace(/\s/gi, '');
    return title;
  }

  // Not authenticated
  notAuth() {
    return 'not-auth';
  }
}