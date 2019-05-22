const ON_ENTER_COMMAND = 'on-enter';

class Command {
    constructor(props) {
        this.prefix = props.prefix;
        this.id = props.id;
        this.label = props.label;
        this.subcommands = props.subcommands ? props.subcommands : []; 
        this.action = props.action;
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
                id: 'open_website',
                label: 'Open website',
                action: () => { 
                    window.open('https://github.com/prezesp', "_blank");
                }
            }),
            new Command({
                id: 'search',
                prefix: 'search',
                label: 'Search app',
                subcommands: [
                    new Command({
                        id: ON_ENTER_COMMAND,
                        action: (text, api) => { api.onSearch(text); }
                    })
                ]
            })
        ],
    })
];



export default commands_config;