
<header>
    <h1 class="text-center">{{schemaDetails.title}}</h1>
</header>
<div class="container">
    <div class="row">
        <article class="col-sm-6">
            <h3 class="subtitle"><i class="fa fa-paper-plane"></i> {{schemaDetails.firstTitle}}</h3>
            {{#first}}
            <p>{{{.}}}</p>
            {{/first}}
        </article>
        <div class="spliter visible-xs"></div>
        <article class="col-sm-6">
            <h3 class="subtitle">
                <i class="fa fa-quote-left"></i>
                <b class="font-wide">{{schemaDetails.secondTitle}} {{details.time}}</b>
            </h3>
            {{#second}}
            <p>{{{.}}}</p>
            {{/second}}
        </article>
    </div>
</div>
