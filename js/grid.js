var grid_render_to = 'grid_js';
var colors = ['aqua','gold','chartreuse','greenyellow','lightskyblue','orange','plum'];

var standard_letter_distribution = [11.3, 1.9, 2.9, 3.6, 13.0, 1.1, 2.0, 2.4, 6.3, 0.3, 1.1, 5.1, 2.9, 6.0, 7.7, 2.9, 0.1, 6.9, 8.8, 7.2, 2.4, 0.8, 1.1, 0.3, 1.6, 0.3];

function render_grid(puzdata)
{
    document.getElementById(grid_render_to).innerHTML = '';
    width_height(puzdata);
    symmetry(puzdata);
    display_grid(puzdata);
    letter_frequency(puzdata);
}

function width_height(puzdata)
{
    var width_height = puzdata.width + 'x' + puzdata.height;
    var is_unusual_size = false;
    if (puzdata.width != 15 || puzdata.height != 15) { is_unusual_size = true;}
    if (is_unusual_size) {width_height = '<mark>' + width_height + '</mark>';}
    document.getElementById(grid_render_to).innerHTML += 'Grid size: ' + width_height + '<br />\n';
}

function symmetry(puzdata)
{
    var sol = puzdata.solution;
    var sol_length = sol.length;
    var is_symmetric = true;
    for (var i=0; i<sol_length/2; i++)
    {
        if ( (sol.charAt(i) == '.' && sol.charAt(sol_length - 1 - i) != '.') || (sol.charAt(i) != '.' && sol.charAt(sol_length - 1 - i) == '.') )
        {
            is_symmetric = false;
            break;
        }
    }
    var symmetry_text = 'Grid is symmetric';
    if (!is_symmetric) { symmetry_text = '<mark>Grid does not have standard symmetry</mark>'; }
    document.getElementById(grid_render_to).innerHTML += symmetry_text + '<br />\n';
}

/** Helper function to get across and down clues from a square **/

function display_grid() // display_grid(puzdata, color_grid = NULL)
{
    // Mandatory arguments
    var puzdata = arguments[0];
    
    // Optional arguments
    var color_grid = (arguments[1] ? arguments[1] : null);

    var h = puzdata.height; var w = puzdata.width;
    var sol = puzdata.solution;
    var gn = puzdata.sqNbrs;
    var grid_html = '<table class="grid">\n';
    for (var i=0; i<h; i++)
    {
        grid_html += '<tr>';
        for (var j=0; j<w; j++)
        {
            var grid_index = i * w + j;
            var sol_at_index = sol[grid_index];
            var td_class_arr = [];
            var td_class = (sol_at_index == '.' ? ' class=black' : '');
			
			/** For the tooltip **/
			var across_number = puzdata.acrossWordNbrs[grid_index];
			var down_number = puzdata.downWordNbrs[grid_index];
			var tooltip_text = across_number + 'A: ' + puzdata.across_clues[across_number];
			tooltip_text += '<br />';
			tooltip_text += down_number + 'D: ' + puzdata.down_clues[down_number];
			
			/**
			* All cells have the class of "puzcell"
			* Circled ones have an additional "circle" class
			**/
			var div_class_array = ['puzcell'];
			if (puzdata.circles[grid_index])
			{
				div_class_array.push('circle');
			}
			var div_class = ' class="' + div_class_array.join(' ') + '"';
            grid_html += '<td' + td_class + '>\n';
			grid_html += '  <div' + div_class + '>\n';
			grid_html += '    <div class="number">' + gn[grid_index] + '</div>\n';
			grid_html += '    <div class="letter">' + sol_at_index + '</div>\n';
			if (across_number != 0 && down_number != 0)
			{
				grid_html += '    <span class="celltooltip">' + tooltip_text + '</span>\n';
			}
			grid_html += '  </div>\n';
			grid_html += '</td>\n';
        }
        grid_html += '</tr>';
    }
    grid_html += '</table>';
	//console.log(grid_html);
    document.getElementById(grid_render_to).innerHTML += grid_html + '<br />\n';
}

function letter_frequency(puzdata)
{
    var sol = puzdata.solution;
    // Container for letter counts
    var letter_counts = [];
    for (var i=0; i<26; i++) {letter_counts[i] = 0.0;}
    var total_letters = 0;
    for (var i=0; i<sol.length; i++)
    {
        var mychar = sol.charAt(i);
        if (mychar != '.')
        {
            var num = sol.charCodeAt(i) - 65;
            letter_counts[num] += 1;
            total_letters += 1;
        }
    }
    // Divide by total_letters
    var letter_freq = [];
    for (var i=0; i<26; i++) {var f = 100 * letter_counts[i]/total_letters; letter_freq[i] = f;}

    // Array of letters
    var letters = [];
    for (var i=0; i<26; i++) {letters[i] = String.fromCharCode(i+65);}

    // Fake standard counts
    var standard_counts = [];
    for (var i=0; i<26; i++) {standard_counts[i] = Math.round(total_letters * standard_letter_distribution[i]/100);}

    // Add titles to counts
    standard_counts.unshift('Typical puzzle');
    letter_counts.unshift('This puzzle');
    var plot_data = [ standard_counts, letter_counts ];
    
    // Now plot!
    var chart = c3.generate({
        bindto: '#grid0',
        title: {
            text: 'Letter counts'
        },
        data: {
            columns: plot_data,
            type: 'bar',
            labels: true
        },
        axis: {
            x: {
                type: 'category',
                categories: letters
            },
            y: {
                label: 'Count'
            }
        }
    });
    CHARTS['grid'].push(chart);
}


