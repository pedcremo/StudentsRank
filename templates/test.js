var text = '<table class="table table-striped table-hover"> ' +
'<thead class="thead-dark"> ' +
'   <tr><th>Name</th><th>Actions</th><th>XP Points</th><th></th><th ng-repeat"GT in GradedTasks">${GT.name}</th></tr> ' +
'   </thead> ' +
'   <tbody id="idTableRankingBody"> ' +
'       <tr ng-repeat="person in PERSONS"> ' +
'           <td> ' +
'               <a href="#student/${TPL_PERSON.getId()}">${TPL_PERSON.surname}, ${TPL_PERSON.name}</a> ' +
'           </td> ' +
'           <td> ' +
'               <a href="#editStudent/${TPL_PERSON.getId()}"><button class="btnS btn btn-success"> ' +
'               <i class="fa fa-pencil fa-1x"></i></button></a><a href="#deleteStudent/${TPL_PERSON.getId()}"> ' +
'              <button class="btnS btn btn-danger"><i class="fa fa-trash-o fa-1x"></i></button></a> ' +
'          </td> ' +
'            <td> ' +
'                <strong>${TPL_PERSON.getTotalPoints()}</strong> ' +
'            </td> ' +
'            <td> ' +
'                <a href="#addXP/${TPL_PERSON.getId()}"><button class="btnS btn btn-primary">+XP</button></a> ' +
'            </td> ' +
'            <td ng-repeat="GT in GradedTasks"> ' +
'                <input type="number" class="gradedTaskInput" idPerson="${TPL_PERSON.getId()" idGradedTask="${GT[0]}" min=0 max=100 value="${GT[1]}"/> ' +
'            </td> ' +
'        </tr> ' +
'    </tbody> ' +
'</table>';

var virt = document.createElement("html");
virt.innerHTML = text;