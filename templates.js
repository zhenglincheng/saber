const templates = [
    {
        name: 'first',
        description: 'vue template',
        path: './templates/first.hbs',
        target: 'src' + path.sep + 'views',
        decode: 'utf-8',
        suffix: '.vue',
        params: [
            {label: 'name', type: 'String', prompt: 'Enter Name: '},
            {label: 'hometown', type: 'String', prompt: 'Enter hometown: '},
            {label: 'cars', type: 'Set', prompt: 'Enter cars:', length: 2},
            {
                label: 'kids', type: 'Array', prompt: 'Enter kids:',
                length: 1,
                params: [
                    {label: 'name', type: 'String', prompt: 'Enter kid name:'},
                    {label: 'age', type: 'Number', prompt: 'Enter kid age:'}
                ]
            },
            {
                label: 'parent', type: 'Object', prompt: 'Enter Parent:',
                params: [
                    {label: 'father', type: 'String', prompt: 'Enter father name:'},
                    {label: 'mother', type: 'String', prompt: 'Enter mother name:'}
                ]
            }
        ]
    }
];