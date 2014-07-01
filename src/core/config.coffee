Drizzle.Config =
    scriptRoot: 'app'
    urlRoot: ''
    urlSuffix: ''
    attributesReferToId: [
        'for' # for label
        'data-target' #for bootstrap
        'data-parent' #for bootstrap
    ]

    fileNames:
        module: 'index'           # module definition file name
        templates: 'templates'    # merged template file name
        view: 'view-'             # view definition file name prefix
        template: 'template-'     # seprated template file name prefix
        handler: 'handler-'       # event handler file name prefix
        model: 'model-'           # model definition file name prefix
        collection: 'collection-' # collection definition file name prefix
        router: 'router'

    pagination:
        defaultPageSize: 10
        pageKey: '_page'
        pageSizeKey: '_pageSize'
        recordCountKey: 'recordCount'
