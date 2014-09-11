
<header>
    <h1 class="text-center">{{schemaDetails.title}}</h1>
</header>
<div class="container">
    <div class="row">
        <div class="col-sm-6">
            <h3 class="subtitle"><i class="fa fa-paper-plane"></i> {{schemaDetails.firstTitle}}</h3>
            {{#first}}
            <p>{{{.}}}</p>
            {{/first}}
        </div>
        <div class="spliter visible-xs"></div>
        <div class="col-sm-6">
            <h3 class="subtitle">
                <i class="fa fa-quote-left"></i> 
                <b class="font-wide">{{schemaDetails.secondTitle}} {{details.time}}</b>
            </h3>
            {{#second}}
            <p>{{{.}}}</p>
            {{/second}}
        </div>
    </div>
</div>
