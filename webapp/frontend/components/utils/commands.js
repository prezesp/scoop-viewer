const ON_ENTER_COMMAND = 'on-enter';

class Command {
    constructor(props) {
        this.prefix = props.prefix;
        this.id = props.id;
        this.label = props.label;
        this.subcommands = props.subcommands ? props.subcommands : []; 
        this.action = props.action;
        this.args_stack = [] // forwarded, not consumed args
    }

    get_options() {
        return this.subcommands.filter((x) => x.id != ON_ENTER_COMMAND).map((x) => { 
            return {id: x.id, label: x.label}
        });
    }

    get(value) {
        return this.subcommands.find((x) => x.id == value);
    }
}

const commands_config = [
    new Command({
        id: 'start',
        label: 'Start',
        subcommands: [
            new Command({
                id: 'add_bucket',
                label: 'Add bucket',
                prefix: 'Link',
                subcommands: [
                    new Command({
                        id: ON_ENTER_COMMAND,
                        prefix: 'Name',
                        subcommands: [
                            new Command({
                                id: ON_ENTER_COMMAND,
                                action: (api, name, args_stack) => { 
                                    let url = args_stack.pop();
                                    api.onSave(name, url);
                                }
                            })
                        ]
                    })
                ]
            }),
            new Command({
                id: 'open_website',
                label: 'Open website',
                action: () => { 
                    window.open('https://github.com/prezesp', "_blank");
                }
            }),
            new Command({
                id: 'search',
                label: 'Search app',
                prefix: 'search',
                subcommands: [
                    new Command({
                        id: ON_ENTER_COMMAND,
                        action: (api, app_name) => { api.onSearch(app_name); }
                    })
                ]
            })
        ],
    })
];



export default commands_config;